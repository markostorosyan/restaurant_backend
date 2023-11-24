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
import { TokenDto } from '../../common/dto/token.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';
import { OrderPageOptionDto } from './dto/order-page-option.dto';
import { DeletedIdDto } from '../../common/dto/deleted-id.dto';
import { CreateOrderCancelReasonDto } from './dto/create-order-cancel-reason.dto';
import { OrderCancelReasonResponseDto } from './dto/order-cancel-reason-respone.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDto } from './dto/order.dto';
import { PageDto } from '../../common/dto/page.dto';

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
    @AuthUser() customer: TokenDto,
  ): Promise<OrderDto> {
    return this.orderService.create(customer.id, createOrderArrayDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all orders' })
  @Auth([RoleTypeEnum.CUSTOMER])
  findAll(
    @AuthUser() customer: TokenDto,
    @Query() pageOptionsDto: OrderPageOptionDto,
  ): Promise<PageDto<OrderDto>> {
    return this.orderService.findAll(customer.id, pageOptionsDto);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: Uuid): Promise<OrderDto> {
    return this.orderService.findOne(id);
  }

  @Patch('cancel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Cancel order' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  cancelOrder(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: TokenDto,
    @Body() createOrderCancelReasonDto: CreateOrderCancelReasonDto,
  ): Promise<OrderCancelReasonResponseDto> {
    return this.orderService.cancelOrder(
      id,
      user.role,
      createOrderCancelReasonDto,
    );
  }

  @Patch('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Change order status' })
  @Auth([RoleTypeEnum.ADMIN])
  changeOrderStatus(
    @UUIDParam('id') id: Uuid,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return this.orderService.changeOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DeletedIdDto, description: 'Delete order' })
  remove(@UUIDParam('id') id: Uuid): Promise<DeletedIdDto> {
    return this.orderService.delete(id);
  }
}
