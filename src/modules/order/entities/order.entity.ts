import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
// import { OrderProductQuantityEntity } from './order-product.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends AbstractEntity {
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

  // @OneToMany(
  //   () => OrderProductQuantityEntity,
  //   (orderProductQuantityEntity) => orderProductQuantityEntity.order,
  // )
  // ordersProductQuantities!: OrderProductQuantityEntity[];
}
