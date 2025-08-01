import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { ShippingAddress } from '../user/entities/shipping-address.entity';
import { User } from '../user/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';
import { OrderItem } from './entities/order-item.entity';
import { UpdateStatusDTO } from './dto/update-status.dto';

@Injectable()
export class OrderService {
  constructor(private dataSource: DataSource) {}
  async create(createOrderDto: CreateOrderDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Get the full user entity
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 2. Create shipping address
      const shippingAddress = queryRunner.manager.create(
        ShippingAddress,
        createOrderDto,
      );
      await queryRunner.manager.save(shippingAddress);

      // 3. Load user's cart
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // 4. Create and save the order
      const order = queryRunner.manager.create(Order, {
        user,
        totalPrice: cart.totalAmount,
        shippingAddress,
        items: [],
      });
      await queryRunner.manager.save(order);

      // 5. Create and save the OrderItems and update product quantities
      for (const item of cart.items) {
        // Create order item
        const orderItem = queryRunner.manager.create(OrderItem, {
          product: item.product,
          quantity: item.quantity,
          price: item.priceAtTime,
          order,
        });
        await queryRunner.manager.save(orderItem);

        // Update product quantity
        item.product.availableQuantity -= item.quantity;
        await queryRunner.manager.save(item.product);
      }

      // 6. Clear cart
      cart.items = [];
      cart.totalItems = 0;
      cart.totalAmount = 0;
      await queryRunner.manager.save(cart);

      // 7. Commit transaction
      await queryRunner.commitTransaction();

      // 8. Reload and return the complete order with all relations
      const fullOrder = await this.dataSource.getRepository(Order).findOne({
        where: { id: order.id },
        relations: ['user', 'items', 'items.product', 'shippingAddress'],
      });

      return fullOrder;
    } catch (error: unknown) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to create order: ${errorMessage}`,
      );
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  findAll() {
    return this.dataSource.getRepository(Order).find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findByUserId(userId: string) {
    try {
      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }

      const orders = await this.dataSource.getRepository(Order).find({
        where: { user: { id: userId } },
        relations: ['items', 'items.product', 'shippingAddress'],
        order: { createdAt: 'DESC' },
      });

      return orders;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to fetch user orders: ${errorMessage}`,
      );
    }
  }

  async findOne(id: string) {
    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: ['user', 'items', 'items.product', 'shippingAddress'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateStatus(updateStatusDto: UpdateStatusDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: updateStatusDto.orderId },
      });
      if (!order) {
        throw new NotFoundException(
          `Order with id ${updateStatusDto.orderId} not found`,
        );
      }

      order.status = updateStatusDto.status;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to update order status: ${errorMessage}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['items'],
      });
      if (!order) {
        throw new NotFoundException(`Order with id ${id} not found`);
      }

      await queryRunner.manager.remove(order);
      await queryRunner.commitTransaction();

      return { message: `Order with id ${id} has been removed` };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Failed to remove order: ${errorMessage}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
