import { IsDecimal, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderEntity } from '../entities/order.entity';
import { Type } from 'class-transformer';
import { OrderProductDto } from './order-product-entity.dto';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class OrderDto extends AbstractDto {
  @IsDecimal()
  total!: number;

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
    this.total = orderEntity.total;
    this.customer_id = orderEntity.customer_id;
    this.status = orderEntity.status;
    this.orderProducts = orderEntity.orderProducts?.toDtos();
  }
}
