import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { OrderProductHistoryDto } from '../dto/order-product-history.dto';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderHistoryDto } from '../dto/order-history.dto';

@Entity({ name: 'orders_history' })
@UseDto(OrderHistoryDto)
export class OrderHistoryEntity extends AbstractEntity<OrderHistoryDto> {
  @Column()
  amount!: number;

  @Column('uuid')
  customerId: Uuid;

  @Column('jsonb', { array: true })
  products!: OrderProductHistoryDto[];
}
