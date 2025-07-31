import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import 'reflect-metadata';
import { DecimalToNumberTransformer } from 'src/common/Transformer/DecimalToNumberTransformer';
import { Category } from 'src/modules/category/entities/category.entity';
import { CartItem } from 'src/modules/cart/entities/cart-item.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  // ✅ Relationship: Many Products belong to One Category
  @ManyToOne(() => Category, (category) => category.products, {
    cascade: true,
    eager: true,
  })
  category: Category;

  @Column('int')
  availableQuantity: number;

  @Column()
  unit: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalToNumberTransformer,
  })
  unitPrice: number;

  @Column()
  productLocation: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { array: true, nullable: true })
  images?: string[]; // Store image URLs or paths

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ✅ Relationship: One Product ➝ Many CartItems
  @OneToMany(() => CartItem, (item) => item.product)
  cartItems?: CartItem[];

  // ✅ Relationship: One Product ➝ Many OrderItems
  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems?: OrderItem[];
}
