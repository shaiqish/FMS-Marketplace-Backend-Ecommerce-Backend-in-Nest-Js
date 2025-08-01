import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import RequestWithUser from 'src/common/interfaces/RequestWithUser.interface';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestWithUser) {
    return this.orderService.create(createOrderDto, req.user.id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('update-status')
  updateStatus(@Body() updateStatusDto: UpdateStatusDTO) {
    return this.orderService.updateStatus(updateStatusDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('user-orders')
  findByUserId(@Req() req: RequestWithUser) {
    return this.orderService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
