import { IsUUID } from 'class-validator';

export class DeletedOrderDto {
  @IsUUID('4')
  id!: Uuid;
}
