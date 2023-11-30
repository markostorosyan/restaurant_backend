import { NotFoundException } from '@nestjs/common';

export class OrderHistoryNotFound extends NotFoundException {
  constructor() {
    super('error.orderHistoryNotFound');
  }
}
