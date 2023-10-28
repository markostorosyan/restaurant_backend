import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { RoleTypeEnum } from '../../../constants/role-type.enum';

@Entity({ name: 'admins' })
export class AdminEntity extends AbstractEntity {
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
  role: RoleTypeEnum.ADMIN;
}
