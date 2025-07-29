import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvironmentConfigModule } from 'src/infra/config/env/environment-config.module';
import { EnvironmentConfigService } from 'src/infra/config/env/environment-config.service';
import { RabbitMQService } from './services/rabbitmq.service';

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				imports: [EnvironmentConfigModule],
				name: 'INVENTORY_SERVICE',
				useFactory: (configService: EnvironmentConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [configService.get<string>('RABBITMQ_URL')],
						queue: configService.get<string>('RABBITMQ_QUEUE'),
						queueOptions: {
							durable: true,
						},
						exchange: configService.get<string>('RABBITMQ_EXCHANGE'),
						prefetchCount: configService.get<number>('RABBITMQ_PREFETCH_COUNT'),
						persistent: true,
					},
				}),
				inject: [EnvironmentConfigService],
			},
		]),
	],
	providers: [RabbitMQService],
	exports: [RabbitMQService, ClientsModule],
})
export class RabbitmqModule {}
