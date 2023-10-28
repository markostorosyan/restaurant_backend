import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleTypeEnum } from '../../../constants/role-type.enum';

@Entity({ name: 'customers' })
export class CustomerEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column('varchar')
  firstName!: string;

  @Column('varchar')
  lastName!: string;

  @Column('varchar')
  phoneNumber!: string;

  @Column('varchar')
  password!: string;

  @Column({ type: 'enum', enum: RoleTypeEnum })
  role: RoleTypeEnum.CUSTOMER;

  @OneToMany(() => OrderEntity, (orderEntity) => orderEntity.customer)
  orders?: OrderEntity[];
}
