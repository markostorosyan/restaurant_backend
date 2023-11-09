import { ApiProperty } from '@nestjs/swagger';

export class LoginPayloadDto {
  @ApiProperty({ type: String })
  token!: string;

  constructor(token: string) {
    this.token = token;
  }
}
