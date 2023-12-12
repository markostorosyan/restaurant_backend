import { NotFoundException } from '@nestjs/common';

export class OrderNotFound extends NotFoundException {
  constructor() {
    super('error.orderNotFound');
  }
}
