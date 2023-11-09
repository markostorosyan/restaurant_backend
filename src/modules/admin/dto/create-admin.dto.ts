import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Billy' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Caldwell' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+37499999998' })
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({ example: 'asd123' })
  @IsString()
  @Length(6)
  password!: string;
}
