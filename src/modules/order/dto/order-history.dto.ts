import { IsDecimal, IsUUID, ValidateNested } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderProductHistoryDto } from './order-product-history.dto';
import { Type } from 'class-transformer';
import { OrderHistoryEntity } from '../entities/order-history.entity';

export class OrderHistoryDto extends AbstractDto {
  @IsDecimal()
  amount!: number;

  @IsUUID('4')
  customerId!: Uuid;

  @Type(() => OrderProductHistoryDto)
  @ValidateNested({ each: true })
  products!: OrderProductHistoryDto[];

  constructor(orderHistoryEntity: OrderHistoryEntity) {
    super(orderHistoryEntity);
    this.amount = orderHistoryEntity.amount;
    this.customerId = orderHistoryEntity.customerId;
    this.products = orderHistoryEntity.products;
  }
}
