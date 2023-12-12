import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundExceptions extends NotFoundException {
  constructor() {
    super('error.categoryNotFound');
  }
}
