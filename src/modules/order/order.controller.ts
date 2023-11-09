import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { Auth } from '../../guards/auth.guard';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { AuthUser } from '../../common/auth-user.decorator';
import { TokenDto } from '../../common/dto/token.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';
import { TotalOrdersDto } from './dto/total-orders.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TotalOrdersDto, description: 'Create Order' })
  @Auth([RoleTypeEnum.CUSTOMER])
  create(
    @Body() createOrderArrayDto: CreateOrderArrayDto,
    @AuthUser() customer: TokenDto,
  ): Promise<TotalOrdersDto> {
    return this.orderService.create(customer.id, createOrderArrayDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleTypeEnum.CUSTOMER])
  findAll(@AuthUser() customer: TokenDto) {
    return this.orderService.findAll(customer.id);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.orderService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
  remove(@UUIDParam('id') id: string) {
    return this.orderService.remove(+id);
  }
}
