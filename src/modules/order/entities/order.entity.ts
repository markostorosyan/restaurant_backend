import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CustomerEntity } from 'src/modules/customer/entities/customer.entity';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderDto } from '../dto/order.dto';
import { OrderProductEntity } from './order-product.entity';
import { OrderStatusEnum } from '../../../constants/order-status.enum';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends AbstractEntity<OrderDto> {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount!: number;

  @Column('uuid')
  customer_id!: Uuid;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status!: OrderStatusEnum;

  @ManyToOne(() => CustomerEntity, (customerEntity) => customerEntity.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer?: CustomerEntity;

  @OneToMany(
    () => OrderProductEntity,
    (orderProductEntity) => orderProductEntity.order,
  )
  orderProducts?: OrderProductEntity[];
}
