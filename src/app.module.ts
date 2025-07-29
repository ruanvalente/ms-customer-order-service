import { Module } from '@nestjs/common';

import { DatabaseModule } from './infra/database/database.module';
import { RabbitmqModule } from './infra/messaging/rabbitmq/rabbitmq.module';
import { CustomerModule } from './modules/customer/customer.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
	imports: [DatabaseModule, CustomerModule, OrdersModule, RabbitmqModule],
})
export class AppModule {}
