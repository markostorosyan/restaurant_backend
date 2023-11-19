import { BadRequestException } from '@nestjs/common';

export class OrderStatusCantBeCanceledException extends BadRequestException {
  constructor() {
    super('error.orderStatusCantBeCanceled');
  }
}
