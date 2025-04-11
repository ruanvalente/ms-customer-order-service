import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './enum/order.status';

@Entity('tb_orders')
export class Orders {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	clientId: number;

	@Column({
		type: 'timestamp with time zone',
		nullable: true,
	})
	createdAt: Date;

	@Column({
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus;

	@ManyToOne(() => Customer, (customer) => customer.orders, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'clientId' })
	customer: Customer;
}
