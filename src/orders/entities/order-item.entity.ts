import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './orders.entity';
import { Grocery } from 'src/groceries/entities/grocery.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { eager: true, onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Grocery, { eager: true })
  grocery: Grocery;

  @Column()
  quantity: number;
}
