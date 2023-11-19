import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ProductService } from '../product/product.service';
import { OrderPageOptionDto } from './dto/order-page-option.dto';
import { YourCartIsEmptyExceptions } from './exceptions/your-cart-is-empty.exception';
import { CreateTotalOrdersDto } from './dto/create-total-orders.dto';
import { OrderNotFound } from './exceptions/oreder-not-found.exception';
import { AbstractDto } from '../../common/dto/abstract.dto';
import { OrderProductEntity } from './entities/order-product.entity';
import { DeletedIdDto } from '../../common/dto/deleted-id.dto';
import { OrderStatusEnum } from '../../constants/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDto } from './dto/order.dto';
import { CreateOrderCancelReasonDto } from './dto/create-order-cancel-reason.dto';
import { OrderCancelReasonEntity } from './entities/order-cancel-reason.entity';
import { RoleTypeEnum } from 'src/constants/role-type.enum';
import { OrderCancelReasonResponseDto } from './dto/order-cancel-reason-respone.dto';
import { OrderStatusCantBeCanceledException } from './exceptions/order-status-cant-be-canceled.exception';
import { PageDto } from '../../common/dto/page.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(OrderCancelReasonEntity)
    private orderCancelReasonRepository: Repository<OrderCancelReasonEntity>,
    private productService: ProductService,
  ) {}

  @Transactional()
  async create(
    customerId: Uuid,
    createOrderArrayDto: CreateOrderArrayDto,
  ): Promise<OrderDto> {
    if (isEmpty(createOrderArrayDto.orders)) {
      throw new YourCartIsEmptyExceptions();
    }
    const ProductsQuantity =
      await this.productService.priceMultiplyQuantity(createOrderArrayDto);

    const orderEntity = this.orderRepository.create({
      customer_id: customerId,
    });

    await this.orderRepository.save(orderEntity);

    const createOrdersProductArray = [];

    for (const product of ProductsQuantity) {
      createOrdersProductArray.push(
        this.createOrderProduct(orderEntity.id, product),
      );
    }

    const totalOrdersEntities = await Promise.all(createOrdersProductArray);

    const total: number = totalOrdersEntities.reduce(
      (first, entity) => first + entity.total,
      0,
    );

    this.orderRepository.merge(orderEntity, { total });

    await this.orderRepository.save(orderEntity);

    return orderEntity.toDto();
  }

  async createOrderProduct(
    orderId: Uuid,
    createTotalOrdersDto: CreateTotalOrdersDto,
  ): Promise<OrderProductEntity> {
    const orderProductEntity = this.orderProductRepository.create({
      ...createTotalOrdersDto,
      order_id: orderId,
      product_id: createTotalOrdersDto.productId,
    });

    await this.orderProductRepository.save(orderProductEntity);

    return orderProductEntity;
  }

  async findAll(
    id: Uuid,
    pageOptionsDto?: OrderPageOptionDto,
  ): Promise<PageDto<AbstractDto>> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      // relations-nery pti grvi
      .leftJoinAndSelect('order.orders', 'orderProduct')
      .leftJoinAndSelect('orderProduct.productOrder', 'products')
      .where('order.customer_id = :customerId', { customerId: id });
    const orderBy = pageOptionsDto?.orderBy || 'createdAt';

    const [items, pageMetaDto] = await result
      .orderBy(`order.${orderBy}`, pageOptionsDto.order)
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<OrderDto> {
    const orderEntity = await this.orderRepository
      .createQueryBuilder('order')
      // relations-nery pti grvi
      .leftJoinAndSelect('order.orders', 'orderProduct')
      .leftJoinAndSelect('orderProduct.productOrder', 'products')
      .where('order.customer_id = :customerId', { customerId: id })
      .getOne();

    if (!orderEntity) {
      throw new OrderNotFound();
    }

    return orderEntity.toDto();
  }

  async changeOrderStatus(
    id: Uuid,
    updateOrderStatus: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    if (updateOrderStatus.status === OrderStatusEnum.CANCELED) {
      throw new OrderStatusCantBeCanceledException();
    }

    const orderEntity = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .andWhere('order.status = :status', {
        status: OrderStatusEnum.PENDING,
      })
      .getOne();

    if (!orderEntity) {
      throw new OrderNotFound();
    }
    this.orderRepository.merge(orderEntity, {
      status: updateOrderStatus.status,
    });

    await this.orderRepository.save(orderEntity);

    return orderEntity.toDto();
  }

  async cancelOrder(
    id: Uuid,
    role: RoleTypeEnum,
    createOrderCancelReasonDto: CreateOrderCancelReasonDto,
  ): Promise<OrderCancelReasonResponseDto> {
    const orderEntity = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .andWhere('order.status = :status', {
        status: OrderStatusEnum.PENDING,
      })
      .getOne();

    if (!orderEntity) {
      throw new OrderNotFound();
    }

    this.orderRepository.merge(orderEntity, {
      status: OrderStatusEnum.CANCELED,
    });

    await this.orderRepository.save(orderEntity);

    const reasonEntity = this.orderCancelReasonRepository.create({
      role,
      orderId: orderEntity.id,
      reason: createOrderCancelReasonDto.reason,
    });

    await this.orderCancelReasonRepository.save(reasonEntity);

    return {
      status: orderEntity.status,
      reason: createOrderCancelReasonDto.reason,
    };
  }

  async delete(id: Uuid): Promise<DeletedIdDto> {
    await this.orderRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .delete()
      .execute();

    return { id };
  }
}
