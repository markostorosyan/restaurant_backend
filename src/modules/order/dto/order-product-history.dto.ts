import { IsNumber, IsString } from 'class-validator';

export class OrderProductHistoryDto {
  @IsString()
  productName!: string;

  @IsNumber()
  quantity!: number;
}
