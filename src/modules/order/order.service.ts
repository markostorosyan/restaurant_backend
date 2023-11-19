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
// import { AccessDeniedException } from '../../exception/access-denied.exception';
import { OrderProductEntity } from './entities/order-product.entity';
import { DeletedOrderDto } from './dto/deleted-order.dto';
import { OrderStatusEnum } from '../../constants/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDto } from './dto/order.dto';
import { CreateOrderCancelReasonDto } from './dto/create-order-cancel-reason.dto';
import { OrderCancelReasonEntity } from './entities/order-cancel-reason.entity';
import { RoleTypeEnum } from 'src/constants/role-type.enum';
import { OrderCancelReasonResponseDto } from './dto/order-cancel-reason-respone.dto';
import { OrderStatusCantBeCanceledException } from './exceptions/order-status-cant-be-canceled.exception';

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
  async create(customerId: Uuid, createOrderArrayDto: CreateOrderArrayDto) {
    if (isEmpty(createOrderArrayDto.orders)) {
      throw new YourCartIsEmptyExceptions();
    }

    // if (createOrderArrayDto.orders.length < 1) {
    //   throw new YourCartIsEmptyExceptions();
    // }

    const formattedTotal = await this.productService.priceMultiplyQuantity(
      createOrderArrayDto,
      // customerId,
    );

    const orderEntity = this.orderRepository.create({
      customer_id: customerId,
    });

    await this.orderRepository.save(orderEntity);

    // const arr = [];
    // const productIds = formattedTotal.map((product) => {
    //   return product.productId;
    // });

    console.log(formattedTotal);

    // const totalOrdersEntity = this.orderProductRepository.create({
    //   customer_id: customerId,
    // });

    // await this.orderProductRepository.save(totalOrdersEntity);

    const createOrderProductArray = [];

    for (const formatted of formattedTotal) {
      createOrderProductArray.push(
        this.createOrderProduct(orderEntity.id, formatted),
      );
    }

    const totalOrdersEntities = await Promise.all(createOrderProductArray);

    console.log(totalOrdersEntities);

    const total: number = totalOrdersEntities.reduce(
      (first, entity) => first + entity.total,
      0,
    );

    this.orderRepository.merge(orderEntity, { total });

    await this.orderRepository.save(orderEntity);

    return orderEntity.toDto();
  }

  async createOrderProduct(orderId: Uuid, product: CreateTotalOrdersDto) {
    const orderProductEntity = this.orderProductRepository.create({
      ...product,
      order_id: orderId,
      product_id: product.productId,
    });

    await this.orderProductRepository.save(orderProductEntity);

    return orderProductEntity;
  }

  // async createTotalOrders(totalId: Uuid, order: CreateTotalOrdersDto) {
  //   const orderEntity = this.orderRepository.create({
  //     ...order,
  //     total_order_id: totalId,
  //     product_id: order.productId,
  //   });
  //   await this.orderRepository.save(orderEntity);

  //   return orderEntity;
  // }

  async findAll(id: Uuid, pageOptionsDto?: OrderPageOptionDto) {
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

    console.log(items);
    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid) {
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

    return orderEntity;
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

  // async deleteProductFromOrder(
  //   id: Uuid,
  //   customerId: Uuid,
  //   createOrderArrayDto: UpdateTotalOrdersDto,
  // ) {
  //   const totalOrdersEntity = await this.findOne(id);

  //   console.log(createOrderArrayDto, '++++');
  //   console.log('++++', totalOrdersEntity.ordersId, '-------');

  //   const test = totalOrdersEntity.ordersId;
  //   // const { quantity, total, products } = test;

  //   // console.log(quantity, '121', total, '741', products)

  //   for (const a of test) {
  //     const { quantity, total, products } = a;

  //     console.log(quantity, '121', total, '741', products);
  //   }

  //   // const deleteOrReduceOrder = [];

  //   // for (const order of totalOrdersEntity.orders) {
  //   //   // deleteOrReduceOrder.push(this.productService.)
  //   //   console.log(order, '0000000000');
  //   //   console.log(order.product_id, '======');
  //   // }
  //   if (!totalOrdersEntity) {
  //     throw new TotalOrdersNotFound();
  //   }

  //   if (totalOrdersEntity.customer_id !== customerId) {
  //     throw new AccessDeniedException();
  //   }

  //   if (totalOrdersEntity.status !== TotalOrdersEnum.PENDING) {
  //     throw new TotalOrdersStatusChangedException();
  //   }
  // }

  // async addProductToOrder(
  //   id: Uuid,
  //   customerId: Uuid,
  //   createOrderArrayDto: UpdateTotalOrdersDto,
  // ) {
  //   const orderEntity = await this.orderRepository
  //     .createQueryBuilder('order')
  //     .where('order.id = :id', { id })
  //     .andWhere('order.status = :status', {
  //       status: OrderStatusEnum.PENDING,
  //     })
  //     .getOne();

  //   if (!orderEntity) {
  //     throw new OrderNotFound();
  //   }

  //   if (orderEntity.customer_id !== customerId) {
  //     throw new AccessDeniedException();
  //   }

  //   if (orderEntity.status !== OrderStatusEnum.PENDING) {
  //     throw new OrderStatusChangedException();
  //   }

  //   const formattedTotal = await this.productService.priceMultiplyQuantity(
  //     createOrderArrayDto,
  //     // customerId,
  //   );

  //   const createOrderProductArray = [];

  //   for (const formatted of formattedTotal) {
  //     createOrderProductArray.push(
  //       this.createOrderProduct(orderEntity.id, formatted),
  //     );
  //   }

  //   const totalOrdersEntities = await Promise.all(createOrderProductArray);

  //   const total: number = totalOrdersEntities.reduce(
  //     (first, entity) => first + entity.total,
  //     orderEntity.total,
  //   );

  //   this.orderProductRepository.merge(orderEntity, { total });

  //   await this.orderProductRepository.save(orderEntity);

  //   // after test add toDto()
  //   return orderEntity;
  //   // await this.totalOrdersRepository.merge(totalOrdersEntity, updateOrderDto)
  // }

  async remove(id: Uuid): Promise<DeletedOrderDto> {
    await this.orderRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .delete()
      .execute();

    return { id };
  }
}
