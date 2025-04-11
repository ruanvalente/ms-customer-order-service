import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RabbitmqModule } from 'src/infra/messaging/rabbitmq/rabbitmq.module';
import { OrderController } from './controllers/order.controller';

import { OrderItem } from './entities/order-item.entity';
import { Orders } from './entities/orders.entity';
import { OrderService } from './services/order.service';

@Module({
	imports: [TypeOrmModule.forFeature([Orders, OrderItem]), RabbitmqModule],
	providers: [OrderService],
	controllers: [OrderController],
})
export class OrdersModule {}
