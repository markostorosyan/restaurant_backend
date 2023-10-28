import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.category)
  products?: ProductEntity;
}
