import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductChangedCategoryDto {
  @IsString()
  productName!: string;

  @IsDecimal()
  price!: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID('4')
  category_id: Uuid;

  @IsString()
  categoryName!: string;
}
