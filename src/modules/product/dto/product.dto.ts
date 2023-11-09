import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ProductEntity } from '../entities/product.entity';

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

  constructor(productEntity: ProductEntity) {
    super(productEntity);
    this.productName = productEntity.productName;
    this.price = productEntity.price;
    this.image = productEntity.image || '';
    this.description = productEntity.description || '';
    this.category_id = productEntity.category_id;
  }
}
