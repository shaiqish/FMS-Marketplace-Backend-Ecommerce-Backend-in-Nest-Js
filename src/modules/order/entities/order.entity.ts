import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { ShippingAddress } from 'src/modules/user/entities/shipping-address.entity';
import { DecimalToNumberTransformer } from 'src/common/Transformer/DecimalToNumberTransformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalToNumberTransformer,
  })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => ShippingAddress, { cascade: true, eager: true })
  @JoinColumn()
  shippingAddress: ShippingAddress;
}
