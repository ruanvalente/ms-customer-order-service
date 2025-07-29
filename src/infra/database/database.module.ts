import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from 'src/modules/customer/entities/customer.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Orders } from 'src/modules/orders/entities/orders.entity';
import { EnvironmentConfigModule } from '../config/env/environment-config.module';
import { EnvironmentConfigService } from '../config/env/environment-config.service';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [EnvironmentConfigModule],
			inject: [EnvironmentConfigService],
			useFactory: (configService: EnvironmentConfigService) => ({
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
