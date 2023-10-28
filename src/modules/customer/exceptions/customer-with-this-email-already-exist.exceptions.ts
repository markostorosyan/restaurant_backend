import { BadRequestException } from '@nestjs/common';

export class CustomerWithThisEmailAlreadyExistExceptions extends BadRequestException {
  constructor() {
    super('error.customerWithThisEmailAlready');
  }
}
