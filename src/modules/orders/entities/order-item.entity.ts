import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity('tb_order_items')
export class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	orderId: number;

	@Column()
	productId: number; // productId from ms-product-service

	@Column('int')
	quantity: number;

	@Column('decimal', { precision: 10, scale: 2 })
	unitPrice: number;

	@ManyToOne(() => Orders, (order) => order.items, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'orderId' })
	order: Orders;
}
