import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleTypeEnum } from '../../constants/role-type.enum';
import { Auth } from '../../guards/auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create category ' })
  @Auth([RoleTypeEnum.ADMIN])
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<void> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CategoryEntity, description: 'Get all category' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  getAll(): Promise<CategoryEntity[]> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CategoryEntity, description: 'Get category by id' })
  @Auth([RoleTypeEnum.ADMIN, RoleTypeEnum.CUSTOMER])
  findOne(@Param('id') id: Uuid): Promise<CategoryEntity> {
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CategoryEntity, description: 'Update category' })
  @Auth([RoleTypeEnum.ADMIN])
  update(
    @Param('id') id: Uuid,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    // mb change return
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete category' })
  @Auth([RoleTypeEnum.ADMIN])
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.categoryService.delete(id);
  }
}
