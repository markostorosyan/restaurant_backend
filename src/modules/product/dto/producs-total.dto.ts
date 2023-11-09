import { IsDecimal } from 'class-validator';

export class ProductsTotalDto {
  @IsDecimal()
  total!: number;
}
