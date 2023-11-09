import { IsDate, IsUUID } from 'class-validator';
import type { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @IsUUID('4')
  id: Uuid;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
