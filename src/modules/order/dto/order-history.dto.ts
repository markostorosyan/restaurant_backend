import { IsArray, IsDecimal, IsObject, IsUUID } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderHistoryEntity } from '../entities/order-history.entity';

export class OrderHistoryDto extends AbstractDto {
  @IsDecimal()
  amount!: number;

  @IsUUID('4')
  customerId!: Uuid;

  @IsArray()
  @IsObject({ each: true })
  products?: object[];

  constructor(orderHistoryEntity: OrderHistoryEntity) {
    super(orderHistoryEntity);
    this.amount = orderHistoryEntity.amount;
    this.customerId = orderHistoryEntity.customerId;
    this.products = orderHistoryEntity.products;
  }
}
