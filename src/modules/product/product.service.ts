import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileRemove, fileUpload } from '../../utils';
import { ProductEntity } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { ProductNotFoundExceptions } from './exceptions/product-not-found.exceptions';
import { PageDto } from '../../common/dto/page.dto';
import { ProductPageOptionDto } from './dto/product-page-option.dto';
import { ProductDto } from './dto/product.dto';
import { Transactional } from 'typeorm-transactional';
import { ChangeCategoryDto } from './dto/change-product-category.dto';
import {
  CreateOrderArrayDto,
  CreateOrderDto,
} from '../order/dto/create-order.dto';
import { ProductsTotalDto } from './dto/producs-total.dto';
import { ProductQuantityDto } from './dto/product-quantity.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoryService: CategoryService,
  ) {}

  @Transactional()
  async priceMultiplyQuantity(
    createOrderArrayDto: CreateOrderArrayDto,
    customerId: Uuid,
  ): Promise<ProductQuantityDto[]> {
    const results = await Promise.all(
      createOrderArrayDto.orders.map(async (order: CreateOrderDto) => {
        const { productId, quantity } = order;

        const totalAmount = await this.productRepository
          .createQueryBuilder('product')
          .select(['product.id', 'product.price'])
          .where('product.id = :productId', { productId })
          .getOne();

        if (!totalAmount) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        const totalPrice = totalAmount.price * quantity;
        return {
          productId,
          total: parseFloat(totalPrice.toFixed(2)),
          quantity,
          customer_id: customerId,
        };
        // return totalPrice;
      }),
    );

    console.log(results, 'sssssssssss');

    // const total = results.reduce(
    //   (first, productsTotalPrice) => first + productsTotalPrice,
    // );
    // return { total: parseFloat(total.toFixed(2)) };
    return results;
  }

  @Transactional()
  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const categoryEntity = await this.categoryService.findByName(
      createProductDto.categoryName,
    );

    const newProduct = this.productRepository.create({
      ...createProductDto,
      category_id: categoryEntity.id,
    });
    await this.productRepository.save(newProduct);

    return newProduct.toDto();
  }

  @Transactional()
  async createWithImage(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<ProductDto> {
    const categoryEntity = await this.categoryService.findByName(
      createProductDto.categoryName,
    );

    const newProduct = this.productRepository.create({
      ...createProductDto,
      category_id: categoryEntity.id,
    });
    await this.productRepository.save(newProduct);

    const image = await fileUpload(
      file,
      'products',
      newProduct.id,
      newProduct.productName,
    );

    this.productRepository.merge(newProduct, { image });
    await this.productRepository.save(newProduct);

    return newProduct.toDto();
  }

  async findAll(
    pageOptionsDto: ProductPageOptionDto,
  ): Promise<PageDto<ProductEntity>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    const orderBy = pageOptionsDto?.orderBy || `createdAt`;

    const [items, pageMetaDto] = await queryBuilder
      .orderBy(`transaction.${orderBy}`, pageOptionsDto.order)
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<ProductDto> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    return productEntity.toDto();
  }

  async changeCategory(id: Uuid, changeCategoryDto: ChangeCategoryDto) {
    const categoryDto = await this.categoryService.findByName(
      changeCategoryDto.categoryName,
    );

    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    this.productRepository.merge(productEntity, {
      category_id: categoryDto.id,
    });
    await this.productRepository.save(productEntity);

    return { ...productEntity.toDto(), categoryName: categoryDto.name };
  }

  async update(
    id: Uuid,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    this.productRepository.merge(productEntity, updateProductDto);
    await this.productRepository.save(productEntity);

    return productEntity.toDto();
  }

  async updateImage(id: Uuid, file?: Express.Multer.File): Promise<ProductDto> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    if (productEntity.image) {
      await fileRemove(productEntity.image);
    }

    const image = await fileUpload(
      file,
      'products',
      productEntity.id,
      productEntity.productName,
    );

    this.productRepository.merge(productEntity, { image });
    await this.productRepository.save(productEntity);

    return productEntity.toDto();
  }

  async delete(id: Uuid): Promise<void> {
    const productEntity = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!productEntity) {
      throw new ProductNotFoundExceptions();
    }

    this.productRepository.remove(productEntity);
  }
}