import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'email@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+37499999999' })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
