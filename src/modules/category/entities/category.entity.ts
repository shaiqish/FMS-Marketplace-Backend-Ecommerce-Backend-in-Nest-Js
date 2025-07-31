import { Product } from 'src/modules/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryName } from 'src/common/enums/CategoryName.enum';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: CategoryName, unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
