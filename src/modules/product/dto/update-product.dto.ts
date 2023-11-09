import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Some pizza' })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({ example: 21 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'pizza with something' })
  @IsString()
  @IsOptional()
  description?: string;
}
