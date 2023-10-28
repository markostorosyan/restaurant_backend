import { BadRequestException } from '@nestjs/common';

export class AccessDeniedException extends BadRequestException {
  constructor() {
    super('error.AccessDenied');
  }
}
