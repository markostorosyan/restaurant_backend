import { IsDecimal, IsNumber, IsUUID } from 'class-validator';

export class CreateTotalOrdersDto {
  @IsUUID('4')
  productId!: Uuid;

  @IsDecimal()
  total!: number;

  @IsNumber()
  quantity!: number;

  // @IsUUID('4')
  // customer_id!: Uuid;
}
