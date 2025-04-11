import { Orders } from 'src/modules/orders/entities/orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_customer')
export class Customer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	name: string;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: true })
	phoneNumber: string;

	@OneToMany(() => Orders, (order) => order.customer)
	orders: Orders[];
}
