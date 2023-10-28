import { BadRequestException } from '@nestjs/common';

export class CategoryWithThisNameAlreadyExistExceptions extends BadRequestException {
  constructor() {
    super('error.categoryWithThisNameAlready');
  }
}
