import {
  IsDecimal,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderEntity } from '../entities/order.entity';
import { Type } from 'class-transformer';
import { OrderProductDto } from './order-product.dto';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class OrderDto extends AbstractDto {
  @IsDecimal()
  amount!: number;

  @IsUUID('4')
  customer_id!: Uuid;

  @IsEnum(() => OrderStatusEnum)
  status!: OrderStatusEnum;

  @Type(() => OrderProductDto)
  @ValidateNested({ each: true })
  @IsOptional()
  orderProducts?: OrderProductDto[];

  constructor(orderEntity: OrderEntity) {
    super(orderEntity);
    this.amount = orderEntity.amount;
    this.customer_id = orderEntity.customer_id;
    this.status = orderEntity.status;
    this.orderProducts = orderEntity.orderProducts?.toDtos();
  }
}
