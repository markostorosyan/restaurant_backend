import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { ProductEntity } from './entities/product.entity';
import { Auth } from '../../guards/auth.guard';
import { PageDto } from '../../common/dto/page.dto';
import { ProductPageOptionDto } from './dto/product-page-option.dto';
import { ProductDto } from './dto/product.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';
import { ChangeCategoryDto } from './dto/change-product-category.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

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
  ): Promise<ProductDto> {
    if (file) {
      return this.productService.createWithImage(createProductDto, file);
    }
    return this.productService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all products' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  findAll(
    @Query() pageOptionsDto: ProductPageOptionDto,
  ): Promise<PageDto<ProductEntity>> {
    return this.productService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProductDto, description: 'Get one product' })
  @Auth([RoleTypeEnum.ADMIN])
  findOne(@UUIDParam('id') id: Uuid) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProductDto, description: 'Update one product by id' })
  @Auth([RoleTypeEnum.ADMIN])
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Patch('image/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdateProductImageDto,
    description: 'Update product by id',
  })
  @Auth([RoleTypeEnum.ADMIN])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  updateImage(
    @UUIDParam('id') id: Uuid,
    @UploadedFile() file: Express.Multer.File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() updateProductImageDto: UpdateProductImageDto, // for swagger test
  ) {
    return this.productService.updateImage(id, file);
  }

  @Patch('category/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ProductDto, description: 'Update product category' })
  @Auth([RoleTypeEnum.ADMIN])
  changeCategory(
    @UUIDParam('id') id: Uuid,
    @Body() changeCategoryDto: ChangeCategoryDto,
  ) {
    return this.productService.changeCategory(id, changeCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete product by id' })
  @Auth([RoleTypeEnum.ADMIN])
  remove(@UUIDParam('id') id: Uuid) {
    return this.productService.delete(id);
  }
}
