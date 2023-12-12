import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class OrderCancelReasonResponseDto {
  @IsUUID('4')
  id!: Uuid;

  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;

  @IsString()
  @IsOptional()
  reason?: string | null;
}
