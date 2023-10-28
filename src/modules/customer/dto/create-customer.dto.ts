import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'email@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+37499999999' })
  @IsPhoneNumber()
  phoneNumber!: string;

  @ApiProperty({ example: 'asd123' })
  @IsString()
  @Length(6)
  password!: string;
}
