import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { CartModule } from '../cart/cart.module';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    CartModule,
    UserModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
