import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQService } from 'src/infra/messaging/rabbitmq/services/rabbitmq.service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { OrderRequestDTO } from '../entities/dto/request/order.request.dto';
import { InventoryResponseDTO } from '../entities/dto/response/inventory.response.dto';
import { OrderResponseDTO } from '../entities/dto/response/order.response.dto';
import { InventoryStatus } from '../entities/enum/inventory.status';
import { OrderStatus } from '../entities/enum/order.status';
import { OrderResponseMapper } from '../entities/mappers/order-response.mapper';
import { OrderItem } from '../entities/order-item.entity';
import { Orders } from '../entities/orders.entity';

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);
	private readonly ERROR_MESSAGE = {
		PRODUCT_NOT_FOUND: 'não encontrado',
		INSUFFICIENT_STOCK: 'Estoque insuficiente',
	} as const;

	constructor(
		@InjectRepository(Orders)
		private orderRepository: Repository<Orders>,

		@InjectRepository(OrderItem)
		private orderItemRepository: Repository<OrderItem>,
		@InjectRepository(Customer)
		private customerRepository: Repository<Customer>,
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
		const customer = await this.customerRepository.findOne({
			where: { id: orderDTO.clientId },
		});

		if (!customer) {
			throw new NotFoundException({
				message: 'Client not found',
				data: [],
			});
		}

		if (!orderDTO?.clientId) {
			throw new BadRequestException({
				message: 'Client ID is required',
				data: [],
			});
		}

		const existingOrder = await this.orderRepository.findOne({
			where: { clientId: orderDTO.clientId },
			relations: ['items'],
		});

		if (existingOrder) {
			throw new BadRequestException({
				message: 'Order already exists for this client',
				data: [],
			});
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

		return OrderResponseMapper.toDTO(savedOrder);
	}

	async validateOrder(orderId: number): Promise<OrderResponseDTO> {
		this.logger.log(`Validating order: ${orderId}`);

		const order = await this.findById(orderId);

		if (!order) {
			throw new NotFoundException('Order not found');
		}

		try {
			const validationResponse =
				await this.rabbitmqService.sendOrderForValidation({
					clientId: order.clientId,
					items: order.items,
				});

			// Update order status based on validation response
			const status =
				validationResponse.status === InventoryStatus.ERROR
					? OrderStatus.REJECTED
					: OrderStatus.APPROVED;

			const updatedOrder = await this.orderRepository.save({
				...order,
				status,
			});

			// If validation failed, throw the error after updating status
			if (validationResponse.status === InventoryStatus.ERROR) {
				this.handleInventoryError(validationResponse);
			}

			return OrderResponseMapper.toDTO(updatedOrder);
		} catch (error) {
			// Update order status to REJECTED and rethrow the error
			await this.orderRepository.save({
				...order,
				status: OrderStatus.REJECTED,
			});

			this.logger.error(`Failed to validate order ${orderId}:`, error);
			throw error;
		}
	}

	private handleInventoryError(response: InventoryResponseDTO): never {
		this.logger.error(`Inventory error: ${response.message}`);

		const errorMap = new Map([
			[
				this.ERROR_MESSAGE.PRODUCT_NOT_FOUND,
				() => new NotFoundException({ message: response.message, data: [] }),
			],
			[
				this.ERROR_MESSAGE.INSUFFICIENT_STOCK,
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
