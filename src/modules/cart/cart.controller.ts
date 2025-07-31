import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDTO } from './dto/add-item.dto';
import { ChangeQuantityDTO } from './dto/change-quantity.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  getCart(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Post('add-item')
  addItemToCart(@Body() addItemDTO: AddItemDTO) {
    return this.cartService.addItemToCart(addItemDTO);
  }
  @Post('remove-item')
  removeItemToCart(
    @Body('userId') userId: string,
    @Body('productId') productId: string,
  ) {
    return this.cartService.removeCartItem(userId, productId);
  }

  @Post('increment-item')
  incrementCartItem(@Body() changeQuantityDTO: ChangeQuantityDTO) {
    return this.cartService.incrementCartItemQuantity(changeQuantityDTO);
  }

  @Post('decrement-item')
  decrementCartItem(@Body() changeQuantityDTO: ChangeQuantityDTO) {
    return this.cartService.decrementCartItemQuantity(changeQuantityDTO);
  }

  @Delete(':id')
  clearCart(@Param('id') id: string) {
    return this.cartService.clearCart(id);
  }
}
