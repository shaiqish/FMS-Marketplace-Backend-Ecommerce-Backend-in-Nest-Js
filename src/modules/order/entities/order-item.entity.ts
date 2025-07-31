import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { DecimalToNumberTransformer } from 'src/common/Transformer/DecimalToNumberTransformer';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalToNumberTransformer,
  })
  price: number;
}
