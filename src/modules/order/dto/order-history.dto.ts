import { IsArray, IsDecimal, IsUUID, ValidateNested } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderHistoryEntity } from '../entities/order-history.entity';
import { Type } from 'class-transformer';
import { OrderHistoryProductsDto } from './order-history-products.dto';

export class OrderHistoryDto extends AbstractDto {
  @IsDecimal()
  amount!: number;

  @IsUUID('4')
  customerId!: Uuid;

  @IsArray()
  @Type(() => OrderHistoryProductsDto)
  @ValidateNested({ each: true })
  products?: OrderHistoryProductsDto[];

  constructor(orderHistoryEntity: OrderHistoryEntity) {
    super(orderHistoryEntity);
    this.amount = orderHistoryEntity.amount;
    this.customerId = orderHistoryEntity.customerId;
    this.products = orderHistoryEntity.products;
  }
}
