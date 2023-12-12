import { BadRequestException } from '@nestjs/common';

export class YourCartIsEmptyExceptions extends BadRequestException {
  constructor() {
    super('error.yourCartIsEmpty');
  }
}
