import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
