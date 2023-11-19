import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Some pizza' })
  @IsString()
  productName!: string;

  @ApiProperty({ example: 10.5 })
  @IsDecimal()
  price!: number;

  @ApiPropertyOptional({ example: 'pizza with something' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'pizza' })
  @IsString()
  categoryName!: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;
}
