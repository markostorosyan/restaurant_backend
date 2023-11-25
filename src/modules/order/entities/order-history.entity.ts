import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { OrderProductHistoryDto } from '../dto/order-product-history.dto';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderHistoryDto } from '../dto/order-history.dto';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';

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

  @Column('jsonb', { nullable: true })
  products?: object[];
}
