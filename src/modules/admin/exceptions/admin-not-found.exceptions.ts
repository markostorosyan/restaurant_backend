import { NotFoundException } from '@nestjs/common';

export class AdminNotFoundExceptions extends NotFoundException {
  constructor() {
    super('error.adminNotFound');
  }
}
