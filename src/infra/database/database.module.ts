import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from 'src/modules/customer/entities/customer.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Orders } from 'src/modules/orders/entities/orders.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USERNAME'),
				password: configService.get<string>('DB_PASSWORD'),
				database: configService.get<string>('DB_DATABASE'),
				entities: [Customer, Orders, OrderItem],
				synchronize: true,
			}),
		}),
		TypeOrmModule.forFeature([Customer, Orders, OrderItem]),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
