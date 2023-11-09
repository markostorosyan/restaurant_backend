import { IsDecimal, IsNumber, IsUUID } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderEntity } from '../entities/order.entity';

export class OrderDto extends AbstractDto {
  @IsUUID('4')
  productId!: Uuid;

  @IsNumber()
  quantity!: number;

  @IsDecimal()
  total!: number;

  @IsUUID('4')
  customer_id!: Uuid;

  constructor(orderEntity: OrderEntity) {
    super(orderEntity);
    this.productId = orderEntity.productId;
    this.quantity = orderEntity.quantity;
    this.total = orderEntity.total;
    this.customer_id = orderEntity.customer_id;
  }
}
