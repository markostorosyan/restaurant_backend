import { RoleTypeEnum } from '../../../constants/role-type.enum';

export class CustomerDto {
  id!: Uuid;

  firstName!: string;

  lastName!: string;

  email!: string;

  phoneNumber!: string;

  role!: RoleTypeEnum;

  createdAt!: Date;

  updatedAt!: Date;
}
