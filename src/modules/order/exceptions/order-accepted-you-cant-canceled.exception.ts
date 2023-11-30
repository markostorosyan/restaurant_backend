import { BadRequestException } from '@nestjs/common';

export class OrderAcceptedYouCantCanceledException extends BadRequestException {
  constructor() {
    super('error.orderAcceptedYouCantCanceled');
  }
}
