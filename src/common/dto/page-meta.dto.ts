import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../../interfaces/page-meta-dto-parameters.interface';
import { IsBoolean, IsNumber } from 'class-validator';

export class PageMetaDto {
  @ApiProperty()
  @IsNumber()
  readonly page: number = 1;

  @ApiProperty()
  @IsNumber()
  readonly take: number = 10;

  @ApiProperty()
  @IsNumber()
  readonly itemCount: number = 0;

  @ApiProperty()
  @IsNumber()
  readonly pageCount: number = 0;

  @ApiProperty()
  @IsBoolean()
  readonly hasPreviousPage: boolean = false;

  @ApiProperty()
  @IsBoolean()
  readonly hasNextPage: boolean = false;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    if (!pageOptionsDto) {
      return;
    }

    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
