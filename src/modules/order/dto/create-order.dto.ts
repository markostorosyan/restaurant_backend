import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsUUID, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: '2651c08f-d37a-45ed-9310-8feb09781d93' })
  @IsUUID('4')
  productId!: Uuid;

  @ApiProperty({ example: 3 })
  @IsNumber()
  quantity!: number;
}

export class CreateOrderArrayDto {
  @ApiProperty({ type: [CreateOrderDto] })
  @Type(() => CreateOrderDto)
  @ValidateNested({ each: true })
  orders!: CreateOrderDto[];
}
