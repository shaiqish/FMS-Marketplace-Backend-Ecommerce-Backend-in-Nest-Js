import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { DecimalToNumberTransformer } from 'src/common/Transformer/DecimalToNumberTransformer';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @Column()
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: DecimalToNumberTransformer,
  })
  priceAtTime: number;
}
