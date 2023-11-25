import { RoleTypeEnum } from '../../../constants/role-type.enum';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity } from 'typeorm';
import { OrderCancelReasonDto } from '../dto/order-cancel-reason.dto';
import { UseDto } from '../../../common/dto/use-dto.decorator';

@Entity({ name: 'order_cancel_reasons ' })
@UseDto(OrderCancelReasonDto)
export class OrderCancelReasonEntity extends AbstractEntity<OrderCancelReasonDto> {
  @Column({ type: 'enum', enum: RoleTypeEnum })
  role!: RoleTypeEnum;

  @Column('uuid')
  orderId!: Uuid;

  @Column('text', { nullable: true })
  reason?: string | null;
}
