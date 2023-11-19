import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { CategoryDto } from './dto/category.dto';
import { UUIDParam } from '../../common/parse-uuid-pipe';
import { DeletedIdDto } from '../../common/dto/deleted-id.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Create category ' })
  @Auth([RoleTypeEnum.ADMIN])
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
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
  findOne(@UUIDParam('id') id: Uuid): Promise<CategoryDto> {
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CategoryEntity, description: 'Update category' })
  @Auth([RoleTypeEnum.ADMIN])
  update(
    @UUIDParam('id') id: Uuid,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Delete category' })
  @Auth([RoleTypeEnum.ADMIN])
  remove(@UUIDParam('id') id: Uuid): Promise<DeletedIdDto> {
    return this.categoryService.delete(id);
  }
}
