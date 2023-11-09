import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AdminEntity } from '../entities/admin.entity';

export class AdminDto extends AbstractDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phoneNumber!: string;

  @IsEnum(RoleTypeEnum)
  role!: RoleTypeEnum;

  constructor(adminEntity: AdminEntity) {
    super(adminEntity);
    this.firstName = adminEntity.firstName;
    this.lastName = adminEntity.lastName;
    this.email = adminEntity.email;
    this.phoneNumber = adminEntity.phoneNumber;
    this.role = adminEntity.role;
  }
}
