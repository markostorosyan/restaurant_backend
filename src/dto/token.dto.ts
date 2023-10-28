import { TokenTypeEnum } from '../constants/token-type.enum';
import { RoleTypeEnum } from '../constants/role-type.enum';

export class TokenDto {
  id!: Uuid;

  email!: string;

  role!: RoleTypeEnum;

  type!: TokenTypeEnum.ACCESS_TOKEN;
}
