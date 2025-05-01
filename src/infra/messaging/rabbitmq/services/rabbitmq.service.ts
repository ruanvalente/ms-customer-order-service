import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { OrderRequestDTO } from 'src/modules/orders/entities/dto/request/order.request.dto';
import { InventoryResponseDTO } from 'src/modules/orders/entities/dto/response/inventory.response.dto';

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

	async sendOrderForValidation(
		orderPayload: OrderRequestDTO,
	): Promise<InventoryResponseDTO> {
		this.logger.log(
			`Sending order for validation: ${JSON.stringify(orderPayload)}`,
		);
		try {
			const response = await firstValueFrom<InventoryResponseDTO>(
				this.inventoryClient.send('inventory-routing-key', orderPayload),
			);
			this.logger.log(`Received response: ${JSON.stringify(response)}`);
			return response;
		} catch (error) {
			this.logger.error('Failed to send order to RabbitMQ', error);
			throw new Error('Failed to validate order: ' + error);
		}
	}
}
