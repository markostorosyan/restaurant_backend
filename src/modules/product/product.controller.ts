import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { ProductEntity } from './entities/product.entity';
import { Auth } from '../../guards/auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create product' })
  @Auth([RoleTypeEnum.ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductEntity> {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all products' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @Auth([RoleTypeEnum.ADMIN])
  findOne(@Param('id') id: Uuid) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Uuid) {
    return this.productService.delete(id);
  }
}
