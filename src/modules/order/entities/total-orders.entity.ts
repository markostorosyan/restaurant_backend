// import { AbstractEntity } from '../../../common/abstract.entity';
// import { UseDto } from '../../../common/dto/use-dto.decorator';
// import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// import { TotalOrdersDto } from '../dto/total-orders.dto';
// import { ColumnNumericTransformer } from '../../../common/decimal.transformer';
// import { CustomerEntity } from '../../customer/entities/customer.entity';
// import { OrderEntity } from './order.entity';
// import { TotalOrdersEnum } from '../../../constants/total-orders-status.enum';

// @Entity({ name: 'total_orders' })
// @UseDto(TotalOrdersDto)
// export class TotalOrdersEntity extends AbstractEntity<TotalOrdersDto> {
//   @Column({
//     type: 'decimal',
//     precision: 10,
//     scale: 2,
//     default: 0,
//     transformer: new ColumnNumericTransformer(),
//   })
//   total!: number;

//   @Column('uuid')
//   customer_id!: Uuid;

//   @Column({
//     type: 'enum',
//     enum: TotalOrdersEnum,
//     default: TotalOrdersEnum.PENDING,
//   })
//   status!: TotalOrdersEnum;

//   @ManyToOne(
//     () => CustomerEntity,
//     (customerEntity) => customerEntity.totalOrders,
//     {
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     },
//   )
//   @JoinColumn({ name: 'customer_id' })
//   customer?: CustomerEntity;

//   @OneToMany(() => OrderEntity, (orderEntity) => orderEntity.totalOrder)
//   ordersId?: OrderEntity[];
// }
