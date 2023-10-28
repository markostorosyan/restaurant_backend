import { NotFoundException } from '@nestjs/common';

export class CustomerNotFoundExceptions extends NotFoundException {
  constructor() {
    super('error.customerNotFound');
  }
}
