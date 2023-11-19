import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;
}
