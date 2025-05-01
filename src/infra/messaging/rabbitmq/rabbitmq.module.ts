import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './services/rabbitmq.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [ConfigModule],
				name: 'INVENTORY_SERVICE',
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							configService.get<string>('RABBITMQ_URL') ??
								'amqp://localhost:5672',
						],
						queue:
							configService.get<string>('RABBITMQ_QUEUE') ?? 'inventory-queue',
						queueOptions: {
							durable: true,
						},
						exchange:
							configService.get<string>('RABBITMQ_EXCHANGE') ??
							'inventory-exchange',
						prefetchCount: Number(
							configService.get<number>('RABBITMQ_PREFETCH_COUNT') || 1,
						),
						persistent: true,
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, ClientsModule],
})
export class RabbitmqModule {}
