import { ClientsModule, Transport } from '@nestjs/microservices';

import { Module } from '@nestjs/common';
import { RabbitMQService } from './services/rabbitmq.service';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'INVENTORY_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'inventory-queue',
					queueOptions: {
						durable: true,
					},
					exchange: 'inventory-exchange',
				},
			},
		]),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, ClientsModule],
})
export class RabbitmqModule {}
