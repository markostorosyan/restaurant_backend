import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { UseDto } from '../../../common/dto/use-dto.decorator';
import { AdminDto } from '../dto/admin.dto';

@Entity({ name: 'admins' })
@UseDto(AdminDto)
export class AdminEntity extends AbstractEntity<AdminDto> {
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
  role: RoleTypeEnum.ADMIN;
}
