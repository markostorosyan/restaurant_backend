import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryWithThisNameAlreadyExistExceptions } from './exceptions/category-with-this-name-already-exist.exception';
import { CategoryNotFoundExceptions } from './exceptions/category-not-found.exception';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const categoryEntity = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name: createCategoryDto.name })
      .getOne();

    if (categoryEntity) {
      throw new CategoryWithThisNameAlreadyExistExceptions();
    }

    const newCategoryEntity = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(newCategoryEntity);

    return newCategoryEntity.toDto();
  }

  async getAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = id')
      .getMany();
  }

  async findById(id: Uuid): Promise<CategoryDto> {
    const categoryEntity = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();

    if (!categoryEntity) {
      throw new CategoryNotFoundExceptions();
    }

    return categoryEntity.toDto();
  }

  async findByName(name: string): Promise<CategoryDto> {
    const categoryEntity = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name = :name', { name })
      .getOne();

    if (!categoryEntity) {
      throw new CategoryNotFoundExceptions();
    }

    return categoryEntity.toDto();
  }

  async update(
    id: Uuid,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const categoryEntity = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .getOne();

    if (!categoryEntity) {
      throw new CategoryNotFoundExceptions();
    }

    this.categoryRepository.merge(categoryEntity, updateCategoryDto);
    await this.categoryRepository.save(updateCategoryDto);

    return categoryEntity.toDto();
  }

  async delete(id: Uuid): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .delete()
      .execute();
  }
}
