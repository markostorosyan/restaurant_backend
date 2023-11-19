import { Type } from 'class-transformer';
import { IsDecimal, IsNumber, ValidateNested } from 'class-validator';
import { UpdateProductDto } from 'src/modules/product/dto/update-product.dto';

export class UpdateTotalOrdersProductDto {
  @IsNumber()
  quantity!: number;

  @IsDecimal()
  total!: number;

  @Type(() => UpdateProductDto)
  @ValidateNested({ each: true })
  products!: UpdateProductDto[];
}
