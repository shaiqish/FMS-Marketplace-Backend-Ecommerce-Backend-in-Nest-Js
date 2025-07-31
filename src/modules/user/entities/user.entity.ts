import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/modules/profile/entity/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'customer' })
  role: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cart: Cart;
}
