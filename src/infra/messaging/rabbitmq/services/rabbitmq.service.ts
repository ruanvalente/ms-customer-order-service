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

	sendOrderForValidation(orderPayload: OrderRequestDTO) {
		this.logger.log(
			`Send order for validation: ${JSON.stringify(orderPayload)}`,
		);

		return this.inventoryClient.emit('order_created', orderPayload);
	}
}
