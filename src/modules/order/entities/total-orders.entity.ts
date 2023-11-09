import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TotalOrdersDto } from '../dto/total-orders.dto';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CustomerEntity } from '../../customer/entities/customer.entity';
import { OrderTotalOrderEntity } from './order-total-order.entity';

@Entity({ name: 'total_orders' })
@UseDto(TotalOrdersDto)
export class TotalOrdersEntity extends AbstractEntity<TotalOrdersDto> {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;

  @Column('uuid', { array: true })
  orderId!: Uuid[];

  @Column('uuid')
  customer_id!: Uuid;

  @ManyToOne(
    () => CustomerEntity,
    (customerEntity) => customerEntity.totalOrders,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;

  @OneToMany(
    () => OrderTotalOrderEntity,
    (orderTotalOrderEntity) => orderTotalOrderEntity.totalOrders,
  )
  totalOrders?: OrderTotalOrderEntity[];
}
