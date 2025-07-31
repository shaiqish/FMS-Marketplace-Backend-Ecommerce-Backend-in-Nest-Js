import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule],
})
export class CartModule {}
