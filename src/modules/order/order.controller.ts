import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { Auth } from '../../guards/auth.guard';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { AuthUser } from '../../common/auth-user.decorator';
import { ShortUserDto } from '../../common/dto/short-user.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';
import { OrderPageOptionDto } from './dto/order-page-option.dto';
import { CreateOrderCancelReasonDto } from './dto/create-order-cancel-reason.dto';
import { OrderCancelReasonResponseDto } from './dto/order-cancel-reason-respone.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDto } from './dto/order.dto';
import { PageDto } from '../../common/dto/page.dto';
import { CanceledOrderPageOptionDto } from './dto/canceled-order-page-option.dto';
import { OrderHistoryPageOptionDto } from './dto/order-history-page-option.dto';
import { OrderHistoryDto } from './dto/order-history.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create Order' })
  @Auth([RoleTypeEnum.CUSTOMER])
  create(
    @Body() createOrderArrayDto: CreateOrderArrayDto,
    @AuthUser() customer: ShortUserDto,
  ): Promise<OrderDto> {
    return this.orderService.create(customer.id, createOrderArrayDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrderDto, description: 'Get all orders' })
  @Auth([RoleTypeEnum.ADMIN])
  findAll(
    @Query() pageOptionsDto: OrderPageOptionDto,
  ): Promise<PageDto<OrderDto>> {
    return this.orderService.findAll(pageOptionsDto);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OrderHistoryDto,
    description: 'For customer get all your order history',
  })
  @Auth([RoleTypeEnum.CUSTOMER])
  getOrdersHistory(
    @Query() pageOptionsDto: OrderHistoryPageOptionDto,
    @AuthUser() customer: ShortUserDto,
  ): Promise<PageDto<OrderHistoryDto>> {
    return this.orderService.getOrdersHistory(customer.id, pageOptionsDto);
  }

  @Get('canceled')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get more details about canceled order' })
  @Auth([RoleTypeEnum.ADMIN])
  getAllCanceled(
    @Query() pageOptionsDto: CanceledOrderPageOptionDto,
  ): Promise<PageDto<OrderDto>> {
    return this.orderService.getAllCanceled(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OrderDto, description: 'Get order by id' })
  @Auth([RoleTypeEnum.ADMIN])
  findOne(@UUIDParam('id') id: Uuid): Promise<OrderDto> {
    return this.orderService.findOne(id);
  }

  @Patch('cancel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: OrderCancelReasonResponseDto,
    description: 'Cancel order',
  })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  cancelOrder(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: ShortUserDto,
    @Body() createOrderCancelReasonDto: CreateOrderCancelReasonDto,
  ): Promise<OrderCancelReasonResponseDto> {
    return this.orderService.cancelOrder(
      id,
      user.role,
      user.id,
      createOrderCancelReasonDto,
    );
  }

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Change order status' })
  @Auth([RoleTypeEnum.ADMIN])
  updateStatus(
    @UUIDParam('id') id: Uuid,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return this.orderService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete('history/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete order history' })
  @Auth([RoleTypeEnum.CUSTOMER])
  deleteHistory(@UUIDParam('id') id: Uuid, @AuthUser() customer: ShortUserDto) {
    return this.orderService.deleteHistory(id, customer.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete order' })
  remove(@UUIDParam('id') id: Uuid): Promise<void> {
    return this.orderService.delete(id);
  }
}
