import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CategoryEntity } from '../../category/entities/category.entity';
// import { OrderProductQuantityEntity } from 'src/modules/order/entities/order-product.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @Column('varchar')
  productName!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price!: number;

  @Column('varchar', { nullable: true })
  image?: string | null;

  @Column('text')
  description?: string;

  @Column('uuid')
  category_id!: Uuid;

  @ManyToOne(
    () => CategoryEntity,
    (categoryEntity) => categoryEntity.products,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;

  // @OneToMany(
  //   () => OrderProductQuantityEntity,
  //   (orderProductEntity) => orderProductEntity.product,
  // )
  // ordersProducts!: OrderProductQuantityEntity[];
}
