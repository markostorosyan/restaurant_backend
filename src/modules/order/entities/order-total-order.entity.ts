import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
// import { UseDto } from '../../../common/dto/use-dto.decorator';
import { TotalOrdersEntity } from './total-orders.entity';

@Entity({ name: 'order_total_orders' })
// @UseDto()
export class OrderTotalOrderEntity extends AbstractEntity {
  @Column('uuid')
  order_id!: Uuid;

  @Column('uuid')
  total_order_id!: Uuid;

  @ManyToOne(() => OrderEntity, (orderEntity) => orderEntity.orders, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @ManyToOne(
    () => TotalOrdersEntity,
    (totalOrdersEntity) => totalOrdersEntity.totalOrders,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'total_order_id' })
  totalOrders!: TotalOrdersEntity[];
}
