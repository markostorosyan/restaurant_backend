import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { Type } from 'class-transformer';

export class UpdateTotalOrdersDto {
  @ApiProperty({ type: CreateOrderDto, isArray: true })
  @Type(() => CreateOrderDto)
  @ValidateNested({ each: true })
  @IsOptional()
  orders?: CreateOrderDto[];

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  forDeleteProduct?: boolean;
}
