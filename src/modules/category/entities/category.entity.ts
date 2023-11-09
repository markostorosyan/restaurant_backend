import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { CategoryDto } from '../dto/category.dto';

@Entity({ name: 'categories' })
@UseDto(CategoryDto)
export class CategoryEntity extends AbstractEntity<CategoryDto> {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.category)
  products?: ProductEntity;
}
