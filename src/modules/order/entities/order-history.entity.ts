import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderHistoryDto } from '../dto/order-history.dto';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { OrderHistoryProductsDto } from '../dto/order-history-products.dto';

@Entity({ name: 'orders_history' })
@UseDto(OrderHistoryDto)
export class OrderHistoryEntity extends AbstractEntity<OrderHistoryDto> {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount!: number;

  @Column('uuid')
  customerId: Uuid;

  @Column('jsonb')
  products?: OrderHistoryProductsDto[];
}
