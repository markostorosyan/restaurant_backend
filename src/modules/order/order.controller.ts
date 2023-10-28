import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { Auth } from '../../guards/auth.guard';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { AuthUser } from '../../common/auth-user.decorator';
import { TokenDto } from '../../dto/token.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Auth([RoleTypeEnum.CUSTOMER])
  create(
    @Body() createOrderArrayDto: CreateOrderArrayDto,
    @AuthUser() user: TokenDto,
  ) {
    return this.orderService.create(user.id, createOrderArrayDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
