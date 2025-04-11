import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infra/database/database.module';
import { RabbitmqModule } from './infra/messaging/rabbitmq/rabbitmq.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
		}),
		DatabaseModule,
		CustomerModule,
		OrdersModule,
		RabbitmqModule,
	],
})
export class AppModule {}
