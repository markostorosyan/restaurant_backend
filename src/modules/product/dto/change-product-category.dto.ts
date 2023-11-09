import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeCategoryDto {
  @ApiProperty({ example: 'pizza' })
  @IsString()
  categoryName!: string;
}
