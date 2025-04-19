import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { OrderRequestDTO } from 'src/modules/orders/entities/dto/request/order.request.dto';

@Injectable()
export class RabbitMQService {
	private readonly logger = new Logger(RabbitMQService.name);

	constructor(
		@Inject('INVENTORY_SERVICE')
		private readonly inventoryClient: ClientProxy,
	) {}

	async onModuleInit() {
		try {
			await this.inventoryClient.connect();
			this.logger.log('Connected to RabbitMQ successfully');
		} catch (error) {
			this.logger.error('Failed to connect to RabbitMQ', error);
		}
	}

	sendOrderForValidation(orderPayload: OrderRequestDTO) {
		this.logger.log(
			`Sending order for validation: ${JSON.stringify(orderPayload)}`,
		);
		this.inventoryClient.emit('inventory-routing-key', orderPayload);
		this.logger.log('Order sent to inventory-queue');
	}
}
