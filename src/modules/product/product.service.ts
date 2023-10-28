import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileUpload } from '../../utils';
import { ProductEntity } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { ProductNotFoundExceptions } from './exceptions/product-not-found.exceptions';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoryService: CategoryService,
  ) {}
  // mb create toDto function for products
  async create(
    createProductDto: CreateProductDto,
    file?: Express.Multer.File,
  ): Promise<ProductEntity> {
    const categoryEntity = await this.categoryService.findByName(
      createProductDto.categoryName,
    );

    const newProduct = this.productRepository.create({
      ...createProductDto,
      category_id: categoryEntity.id,
    });

    if (file) {
      const image = await fileUpload(
        file,
        'products',
        newProduct.id,
        newProduct.productName,
      );

      this.productRepository.merge(newProduct, { image });
      await this.productRepository.save(newProduct);

      return newProduct;
    }

    return newProduct;
  }

  findAll() {
    return `This action returns all product`;
  }

  async findOne(id: Uuid): Promise<ProductEntity> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    return productEntity;
  }

  async update(
    id: Uuid,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    this.productRepository.merge(productEntity, updateProductDto);
    await this.productRepository.save(productEntity);

    return productEntity;
  }

  async delete(id: Uuid): Promise<void> {
    await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .delete()
      .execute();
  }
}
