import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class UpdateTotalOrdersStatusDto {
  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;
}
