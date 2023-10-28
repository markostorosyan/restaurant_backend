import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'asd123' })
  @IsString()
  @Length(6)
  password!: string;
}
