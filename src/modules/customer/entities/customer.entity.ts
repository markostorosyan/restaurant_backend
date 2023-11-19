import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { CustomerDto } from '../dto/customer.dto';
// import { TotalOrdersEntity } from '../../order/entities/total-orders.entity';

@Entity({ name: 'customers' })
@UseDto(CustomerDto)
export class CustomerEntity extends AbstractEntity<CustomerDto> {
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column({ type: 'varchar', unique: true })
  phoneNumber!: string;

  @Column('varchar')
  password!: string;

  @Column({ type: 'enum', enum: RoleTypeEnum })
  role: RoleTypeEnum.CUSTOMER;

  @OneToMany(() => OrderEntity, (orderEntity) => orderEntity.customer)
  orders?: OrderEntity[];

  // @OneToMany(
  //   () => TotalOrdersEntity,
  //   (ordersTotalEntity) => ordersTotalEntity.customer,
  // )
  // totalOrders?: TotalOrdersEntity[];
}
