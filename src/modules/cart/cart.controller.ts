import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDTO } from './dto/add-item.dto';
import { ChangeQuantityDTO } from './dto/change-quantity.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

import RequestWithUser from 'src/common/interfaces/RequestWithUser.interface';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('user-cart')
  async getCart(@Req() req: RequestWithUser) {
    return this.cartService.findOne(req.user.id);
  }

  @Post('add-item')
  addItemToCart(@Body() addItemDTO: AddItemDTO, @Req() req: RequestWithUser) {
    return this.cartService.addItemToCart(addItemDTO, req.user.id);
  }

  @Post('remove-item')
  removeItemFromCart(
    @Body('productId') productId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.cartService.removeCartItem(req.user.id, productId);
  }

  @Post('increment-item')
  incrementCartItem(
    @Body('productId') productId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.cartService.incrementCartItemQuantity(req.user.id, productId);
  }

  @Post('decrement-item')
  decrementCartItem(
    @Body('productId') productId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.cartService.decrementCartItemQuantity(req.user.id, productId);
  }

  @Delete()
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}
