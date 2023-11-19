// import {
//   IsDecimal,
//   IsEnum,
//   IsOptional,
//   IsUUID,
//   ValidateNested,
// } from 'class-validator';
// import { AbstractDto } from '../../../common/dto/abstract.dto';
// import { TotalOrdersEntity } from '../entities/total-orders.entity';
// import { OrderDto } from './order.dto';
// import { ApiProperty } from '@nestjs/swagger';
// import { TotalOrdersEnum } from '../../../constants/total-orders-status.enum';
// import { Type } from 'class-transformer';

// export class TotalOrdersDto extends AbstractDto {
//   @IsDecimal()
//   total!: number;

//   @IsUUID('4')
//   customer_id!: Uuid;

//   @IsEnum(TotalOrdersEnum)
//   status!: TotalOrdersEnum;

//   @ApiProperty({ type: OrderDto, isArray: true })
//   @Type(() => OrderDto)
//   @ValidateNested({ each: true })
//   @IsOptional()
//   orders?: OrderDto[];

//   constructor(totalOrdersEntity: TotalOrdersEntity) {
//     super(totalOrdersEntity);
//     this.total = totalOrdersEntity.total;
//     this.customer_id = totalOrdersEntity.customer_id;
//     this.status = totalOrdersEntity.status;
//     this.orders = totalOrdersEntity.ordersId;
//   }
// }
