import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Orders])],
	providers: [],
	controllers: [],
})
export class OrdersModule {}
