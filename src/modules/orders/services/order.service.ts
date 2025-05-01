import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RabbitMQService } from 'src/infra/messaging/rabbitmq/services/rabbitmq.service';
import { OrderRequestDTO } from '../entities/dto/request/order.request.dto';
import { InventoryResponseDTO } from '../entities/dto/response/inventory.response.dto';
import { OrderResponseDTO } from '../entities/dto/response/order.response.dto';
import { InventoryStatus } from '../entities/enum/inventory.status';
import { OrderResponseMapper } from '../entities/mappers/order-response.mapper';
import { OrderItem } from '../entities/order-item.entity';
import { Orders } from '../entities/orders.entity';

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);
	private readonly errorMessages = {
		PRODUCT_NOT_FOUND: 'não encontrado',
		INSUFFICIENT_STOCK: 'Estoque insuficiente',
	} as const;
	constructor(
		@InjectRepository(Orders)
		private orderRepository: Repository<Orders>,

		@InjectRepository(OrderItem)
		private orderItemRepository: Repository<OrderItem>,
		private readonly rabbitmqService: RabbitMQService,
	) {}

	async findAll(): Promise<OrderResponseDTO[]> {
		const orders = await this.orderRepository.find({
			relations: ['items'],
		});

		return orders.map((order) => OrderResponseMapper.toDTO(order));
	}

	async findById(orderId: number): Promise<OrderResponseDTO> {
		const order = await this.orderRepository.findOne({
			where: { id: orderId },
			relations: ['items', 'customer'],
		});

		if (!order) {
			throw new NotFoundException('Order not found');
		}

		return OrderResponseMapper.toDTO(order);
	}

	async create(orderDTO: OrderRequestDTO): Promise<OrderResponseDTO> {
		const response =
			await this.rabbitmqService.sendOrderForValidation(orderDTO);

		if (response.status === InventoryStatus.ERROR) {
			this.handleInventoryError(response);
		}

		const newOrder = this.orderRepository.create({
			clientId: orderDTO.clientId,
			createdAt: new Date(),
		});

		const savedOrder = await this.orderRepository.save(newOrder);

		const orderItems = orderDTO.items.map((item) =>
			this.orderItemRepository.create({
				productId: item.productId,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				order: savedOrder,
			}),
		);

		const savedItems = await this.orderItemRepository.save(orderItems);

		savedOrder.items = savedItems;

		void this.rabbitmqService.sendOrderForValidation(orderDTO);

		return OrderResponseMapper.toDTO(savedOrder);
	}

	private handleInventoryError(response: InventoryResponseDTO): never {
		this.logger.error(`Inventory error: ${response.message}`);

		const errorMap = new Map([
			[
				this.errorMessages.PRODUCT_NOT_FOUND,
				() => new NotFoundException({ message: response.message, data: [] }),
			],
			[
				this.errorMessages.INSUFFICIENT_STOCK,
				() => new BadRequestException({ message: response.message, data: [] }),
			],
		]);

		for (const [errorMessage, errorFactory] of errorMap) {
			if (response.message.includes(errorMessage)) {
				throw errorFactory();
			}
		}

		throw new InternalServerErrorException({
			message: response.message,
			data: [],
		});
	}
}
