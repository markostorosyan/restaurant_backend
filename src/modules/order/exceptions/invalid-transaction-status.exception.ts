import { BadRequestException } from '@nestjs/common';

export class InvalidTransactionStatusException extends BadRequestException {
  constructor() {
    super('error.invalidTransactionStatus');
  }
}
