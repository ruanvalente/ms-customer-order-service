import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './enum/order.status';
import { OrderItem } from './order-item.entity';

@Entity('tb_orders')
export class Orders {
	@ApiProperty({ example: 1, description: 'Unique identifier of the order' })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({
		example: 123,
		description: 'Customer ID associated with the order',
	})
	@IsInt()
	@IsPositive()
	@Column()
	clientId: number;

	@ApiProperty({
		example: '2025-04-11T12:00:00Z',
		description: 'Date and time when the order was created',
		required: false,
	})
	@IsOptional()
	@IsDate()
	@Column({
		type: 'timestamp with time zone',
		nullable: true,
	})
	createdAt: Date;

	@ApiProperty({
		enum: OrderStatus,
		example: OrderStatus.PENDING,
		description: 'Current status of the order',
	})
	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus;

	@ApiProperty({
		type: () => Customer,
		description: 'Customer entity related to the order',
	})
	@ManyToOne(() => Customer, (customer) => customer.orders, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'clientId' })
	customer: Customer;

	@ApiProperty({
		type: () => [OrderItem],
		description: 'List of items included in the order',
	})
	@OneToMany(() => OrderItem, (item) => item.order, {
		cascade: true,
	})
	items: OrderItem[];
}
