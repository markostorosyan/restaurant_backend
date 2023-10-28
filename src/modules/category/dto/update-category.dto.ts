import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'pizza' })
  @IsString()
  @IsOptional()
  name!: string;
}
