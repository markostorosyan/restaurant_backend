import { BadRequestException } from '@nestjs/common';

export class AdminWithThisEmailAlreadyExistExceptions extends BadRequestException {
  constructor() {
    super('error.adminWithThisEmailAlready');
  }
}
