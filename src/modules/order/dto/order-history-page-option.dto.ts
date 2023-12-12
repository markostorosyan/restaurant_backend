import { IsEnum, IsOptional } from 'class-validator';
import { OrdersOrderByEnum } from '../../../constants/orders-order-by.enum';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderHistoryPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: OrdersOrderByEnum })
  @IsEnum(OrdersOrderByEnum)
  @IsOptional()
  orderBy?: OrdersOrderByEnum;
}
