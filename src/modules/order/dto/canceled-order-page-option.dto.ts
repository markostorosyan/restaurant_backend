import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrdersOrderByEnum } from '../../../constants/orders-order-by.enum';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CanceledOrderPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: OrdersOrderByEnum })
  @IsEnum(OrdersOrderByEnum)
  @IsOptional()
  orderBy?: OrdersOrderByEnum;

  @ApiPropertyOptional({ example: '2651c08f-d37a-45ed-9310-8feb09781d93' })
  @IsUUID('4')
  @IsOptional()
  customerId?: Uuid;
}
