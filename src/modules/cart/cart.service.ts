import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../product/entities/product.entity';
import { AddItemDTO } from './dto/add-item.dto';
import { ChangeQuantityDTO } from './dto/change-quantity.dto';

@Injectable()
export class CartService {
  constructor(private dataSource: DataSource) {}
  // Find all carts (typically for admin)
  async findAll(): Promise<Cart[]> {
    return this.dataSource.getRepository(Cart).find({
      relations: ['items', 'items.product', 'user'],
    });
  }

  // Get cart by user id
  async findOne(id: string): Promise<Cart> {
    const cart = await this.dataSource.getRepository(Cart).findOne({
      where: { user: { id } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }
    return cart;
  }

  async addItemToCart(addItemDTO: AddItemDTO): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: addItemDTO.userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }
      if (!cart.items) {
        cart.items = [];
      }

      const product = await queryRunner.manager.findOne(Product, {
        where: { id: addItemDTO.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with id ${addItemDTO.productId} not found`,
        );
      }

      let cartItem = cart.items.find(
        (item) => item.product.id === addItemDTO.productId,
      );

      if (cartItem) {
        cartItem.quantity += addItemDTO.quantity;
        await queryRunner.manager.save(CartItem, cartItem);
      } else {
        cartItem = queryRunner.manager.create(CartItem, {
          cart,
          product,
          quantity: addItemDTO.quantity,
          priceAtTime: product.unitPrice,
        });
        await queryRunner.manager.save(CartItem, cartItem);
        cart.items.push(cartItem);
      }

      cart.totalItems += addItemDTO.quantity;
      cart.totalAmount += product.unitPrice * addItemDTO.quantity;
      await queryRunner.manager.save(Cart, cart);

      await queryRunner.commitTransaction();
      return cart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeCartItem(userId: string, productId: string): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }

      const cartItem = (cart.items ?? []).find(
        (item) => item.product.id === productId,
      );

      if (!cartItem) {
        throw new NotFoundException(
          `Cart item with product ${productId} not found`,
        );
      }

      cart.totalItems = Math.max(0, cart.totalItems - cartItem.quantity);
      cart.totalAmount = Math.max(
        0,
        cart.totalAmount - cartItem.priceAtTime * cartItem.quantity,
      );

      await queryRunner.manager.remove(CartItem, cartItem);
      await queryRunner.manager.save(Cart, cart);

      await queryRunner.commitTransaction();
      return cart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async decrementCartItemQuantity(
    changeQuantityDTO: ChangeQuantityDTO,
  ): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: changeQuantityDTO.userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }

      const cartItem = (cart.items ?? []).find(
        (item) => item.product.id === changeQuantityDTO.productId,
      );

      if (!cartItem) {
        throw new NotFoundException(
          `Cart item with product ${changeQuantityDTO.productId} not found`,
        );
      }

      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await queryRunner.manager.save(CartItem, cartItem);
      } else {
        await queryRunner.manager.remove(CartItem, cartItem);
      }

      cart.totalItems -= 1;
      cart.totalAmount -= cartItem.priceAtTime;
      await queryRunner.manager.save(Cart, cart);

      await queryRunner.commitTransaction();
      return cart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async incrementCartItemQuantity(
    changeQuantityDTO: ChangeQuantityDTO,
  ): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: changeQuantityDTO.userId } },
        relations: ['items', 'items.product'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }

      const cartItem = cart.items?.find(
        (item) => item.product.id === changeQuantityDTO.productId,
      );

      if (!cartItem) {
        throw new NotFoundException(
          `Cart item with product ${changeQuantityDTO.productId} not found`,
        );
      }

      cartItem.quantity += 1;
      await queryRunner.manager.save(CartItem, cartItem);

      cart.totalItems += 1;
      cart.totalAmount += cartItem.priceAtTime;
      await queryRunner.manager.save(Cart, cart);

      await queryRunner.commitTransaction();
      return cart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Clear all items in a cart
  async clearCart(userId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['items'],
      });
      if (!cart) {
        throw new NotFoundException(`Cart not found`);
      }

      if (cart.items && cart.items.length > 0) {
        await queryRunner.manager.remove(CartItem, cart.items);
        cart.totalItems = 0;
        cart.totalAmount = 0;
        await queryRunner.manager.save(Cart, cart);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
