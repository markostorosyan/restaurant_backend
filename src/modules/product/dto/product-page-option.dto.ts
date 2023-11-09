import { IsEnum, IsOptional } from 'class-validator';
import { ProductOrderByEnum } from '../../../constants/product-order-by.enum';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: ProductOrderByEnum })
  @IsEnum(ProductOrderByEnum)
  @IsOptional()
  orderBy?: ProductOrderByEnum;
}
