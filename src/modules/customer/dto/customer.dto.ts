import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerDto extends AbstractDto {
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

  constructor(customerEntity: CustomerEntity) {
    super(customerEntity);
    this.firstName = customerEntity.firstName;
    this.lastName = customerEntity.lastName;
    this.email = customerEntity.email;
    this.phoneNumber = customerEntity.phoneNumber;
    this.role = customerEntity.role;
  }
}
