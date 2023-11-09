import { IsString } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryDto extends AbstractDto {
  @IsString()
  name!: string;

  constructor(categoryEntity: CategoryEntity) {
    super(categoryEntity);
    this.name = categoryEntity.name;
  }
}
