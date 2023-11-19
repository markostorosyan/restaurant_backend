import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderDto } from '../dto/order.dto';
// import { TotalOrdersEntity } from './total-orders.entity';
import { OrderProductEntity } from './order-product.entity';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  // @Column('uuid')
  // product_id!: Uuid;

  // @Column('int')
  // quantity!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;
  // amount
  @Column('uuid')
  customer_id!: Uuid;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status!: OrderStatusEnum;

  // @Column('uuid')
  // total_order_id!: Uuid;

  @ManyToOne(() => CustomerEntity, (customerEntity) => customerEntity.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;

  // @ManyToOne(
  //   () => TotalOrdersEntity,
  //   (totalOrdersEntity) => totalOrdersEntity.ordersId,
  //   {
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   },
  // )
  // @JoinColumn({ name: 'total_order_id' })
  // totalOrder?: TotalOrdersEntity;

  // @ManyToOne(() => ProductEntity, (productEntity) => productEntity.orders, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'product_id' })
  // products?: ProductEntity;

  @OneToMany(
    () => OrderProductEntity,
    (orderProductEntity) => orderProductEntity.orderProduct,
  )
  orders?: OrderProductEntity[];
  //productOrders
}
