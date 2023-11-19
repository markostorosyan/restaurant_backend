import {
  IsDecimal,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { OrderProductEntity } from '../entities/order-product.entity';
import { ProductDto } from '../../product/dto/product.dto';
import { Type } from 'class-transformer';

export class OrderProductDto extends AbstractDto {
  @IsDecimal()
  total!: number;

  @IsNumber()
  quantity!: number;

  @IsUUID('4')
  order_id!: Uuid;

  @IsUUID('4')
  product_id!: Uuid;

  @Type(() => ProductDto)
  @ValidateNested()
  @IsOptional()
  product?: ProductDto;

  constructor(orderProductEntity: OrderProductEntity) {
    super(orderProductEntity);
    this.total = orderProductEntity.total;
    this.quantity = orderProductEntity.quantity;
    this.order_id = orderProductEntity.order_id;
    this.product_id = orderProductEntity.product_id;
    this.product = orderProductEntity.productOrder.toDto();
    // esi dto vortev 1x a vochte array
  }
}
