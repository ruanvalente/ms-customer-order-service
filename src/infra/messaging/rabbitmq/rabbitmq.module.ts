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
					urls: ['amqp://rabbitmq:5672'],
					queue: 'inventory-queue',
					queueOptions: {
						durable: true,
					},
				},
			},
		]),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, ClientsModule],
})
export class RabbitmqModule {}
