import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { DecimalToNumberTransformer } from 'src/common/Transformer/DecimalToNumberTransformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
  })
  items: CartItem[];

  @Column('int', { default: 0 })
  totalItems: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalToNumberTransformer,
    default: 0,
  })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
