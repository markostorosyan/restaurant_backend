import {
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ProductEntity } from '../entities/product.entity';
import { CategoryDto } from '../../category/dto/category.dto';
import { Type } from 'class-transformer';

export class ProductDto extends AbstractDto {
  @IsString()
  productName!: string;

  @IsDecimal()
  price!: number;

  @IsString()
  @IsOptional()
  image?: string | null;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4')
  category_id!: Uuid;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;

  constructor(productEntity: ProductEntity) {
    super(productEntity);
    this.productName = productEntity.productName;
    this.price = productEntity.price;
    this.image = productEntity.image || '';
    this.description = productEntity.description || '';
    this.category_id = productEntity.category_id;
    this.category = productEntity.category.toDto();
  }
}
