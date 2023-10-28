import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateOrderDto {
  @IsUUID()
  @IsOptional()
  productId?: Uuid;

  @IsNumber()
  @IsOptional()
  total?: number;
}
