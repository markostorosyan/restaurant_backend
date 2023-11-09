import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderDto } from '../dto/order.dto';
import { OrderTotalOrderEntity } from './order-total-order.entity';

// import { OrderProductQuantityEntity } from './order-product.entity';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @Column('uuid')
  productId!: Uuid; // if my logic add Uuid[]

  @Column('int')
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;

  @Column('uuid')
  customer_id!: Uuid;

  @ManyToOne(() => CustomerEntity, (customerEntity) => customerEntity.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;

  @OneToMany(
    () => OrderTotalOrderEntity,
    (orderTotalOrderEntity) => orderTotalOrderEntity.totalOrders,
  )
  orders?: OrderTotalOrderEntity[];

  // @OneToMany(
  //   () => OrderProductQuantityEntity,
  //   (orderProductQuantityEntity) => orderProductQuantityEntity.order,
  // )
  // ordersProductQuantities!: OrderProductQuantityEntity[];
}
