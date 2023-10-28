import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundExceptions extends NotFoundException {
  constructor() {
    super('error.productNotFound');
  }
}
