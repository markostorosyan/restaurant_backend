import { IsUUID } from 'class-validator';

export class DeletedIdDto {
  @IsUUID('4')
  id!: Uuid;
}
