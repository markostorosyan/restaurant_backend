import { IsArray, IsDecimal, IsUUID } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { TotalOrdersEntity } from '../entities/total-orders.entity';

export class TotalOrdersDto extends AbstractDto {
  @IsDecimal()
  total!: number;

  @IsArray()
  @IsUUID('4', { each: true })
  orderId!: Uuid[];

  @IsUUID('4')
  customer_id!: Uuid;

  constructor(totalOrdersEntity: TotalOrdersEntity) {
    super(totalOrdersEntity);
    this.total = totalOrdersEntity.total;
    this.orderId = totalOrdersEntity.orderId;
    this.customer_id = totalOrdersEntity.customer_id;
  }
}
