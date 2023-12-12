import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderCancelReasonDto {
  @ApiPropertyOptional({ example: 'Miss click :)' })
  @IsString()
  @IsOptional()
  reason?: string;
}
