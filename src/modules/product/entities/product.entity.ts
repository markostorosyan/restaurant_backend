import { AfterRemove, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
import { CategoryEntity } from '../../category/entities/category.entity';
import { fileRemove } from 'src/utils';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { ProductDto } from '../dto/product.dto';

// import { OrderProductQuantityEntity } from 'src/modules/order/entities/order-product.entity';

@Entity({ name: 'products' })
@UseDto(ProductDto)
export class ProductEntity extends AbstractEntity<ProductDto> {
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

  @AfterRemove()
  delete() {
    fileRemove(this.image);
  }
}
