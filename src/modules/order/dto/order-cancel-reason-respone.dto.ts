import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class OrderCancelReasonResponseDto {
  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;

  @IsString()
  @IsOptional()
  reason?: string | null;
}
