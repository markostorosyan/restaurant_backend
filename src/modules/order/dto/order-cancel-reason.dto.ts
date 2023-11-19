import { IsEnum, IsString, IsUUID } from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { OrderCancelReasonEntity } from '../entities/order-cancel-reason.entity';

export class OrderCancelReasonDto extends AbstractDto {
  @IsEnum(RoleTypeEnum)
  role!: RoleTypeEnum;

  @IsUUID('4')
  orderId!: Uuid;

  @IsString()
  reason?: string | null;

  constructor(orderCancelReasonEntity: OrderCancelReasonEntity) {
    super(orderCancelReasonEntity);
    this.role = orderCancelReasonEntity.role;
    this.orderId = orderCancelReasonEntity.orderId;
    this.reason = orderCancelReasonEntity?.reason;
  }
}
