import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { OrderProductDto } from '../dto/order-product.dto';

@Entity({ name: 'order_products' })
@UseDto(OrderProductDto)
export class OrderProductEntity extends AbstractEntity<OrderProductDto> {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  total!: number;

  @Column('int')
  quantity!: number;

  @Column('uuid')
  order_id!: Uuid;

  @Column('uuid')
  product_id!: Uuid;

  @ManyToOne(() => OrderEntity, (orderEntity) => orderEntity.orderProducts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.orderProducts,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;
}
