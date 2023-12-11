import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Brackets, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ProductService } from '../product/product.service';
import { OrderPageOptionDto } from './dto/order-page-option.dto';
import { YourCartIsEmptyExceptions } from './exceptions/your-cart-is-empty.exception';
import { CreateTotalOrdersDto } from './dto/create-total-orders.dto';
import { OrderNotFound } from './exceptions/oreder-not-found.exception';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderStatusEnum } from '../../constants/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderDto } from './dto/order.dto';
import { CreateOrderCancelReasonDto } from './dto/create-order-cancel-reason.dto';
import { RoleTypeEnum } from 'src/constants/role-type.enum';
import { OrderCancelReasonResponseDto } from './dto/order-cancel-reason-respone.dto';
import { PageDto } from '../../common/dto/page.dto';
import { OrderHistoryEntity } from './entities/order-history.entity';
import { InvalidTransactionStatusException } from './exceptions/invalid-transaction-status.exception';
import { OrderCancelReasonEntity } from './entities/order-cancel-reason.entity';
import { CanceledOrderPageOptionDto } from './dto/canceled-order-page-option.dto';
import { OrderHistoryPageOptionDto } from './dto/order-history-page-option.dto';
import { OrderHistoryDto } from './dto/order-history.dto';
import { EventsNotificationService } from '../event/events-notification.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(OrderCancelReasonEntity)
    private orderCancelReasonRepository: Repository<OrderCancelReasonEntity>,
    @InjectRepository(OrderHistoryEntity)
    private orderHistoryRepository: Repository<OrderHistoryEntity>,
    private productService: ProductService,
    private eventsNotificationService: EventsNotificationService,
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

    const createOrderProductsArray = [];

    for (const product of ProductsQuantity) {
      createOrderProductsArray.push(
        this.createOrderProduct(orderEntity.id, product),
      );
    }

    const totalOrdersEntities = await Promise.all(createOrderProductsArray);

    const amount: number = totalOrdersEntities.reduce(
      (first, entity) => first + entity.total,
      0,
    );

    this.orderRepository.merge(orderEntity, {
      amount: Number(amount.toFixed(2)),
    });

    await this.orderRepository.save(orderEntity);

    this.eventsNotificationService.sendOrderCreatedEvent([customerId]);

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
    pageOptionsDto: OrderPageOptionDto,
  ): Promise<PageDto<OrderDto>> {
    const result = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'products');

    if (pageOptionsDto.customerId) {
      result.where('order.customer_id = :customerId', {
        customerId: pageOptionsDto.customerId,
      });
    }

    if (pageOptionsDto.status) {
      result.andWhere('order.status = :status', {
        status: pageOptionsDto.status,
      });
    }

    const orderBy = pageOptionsDto?.orderBy || 'createdAt';

    const [items, pageMetaDto] = await result
      .orderBy(`order.${orderBy}`, pageOptionsDto.order)
      .paginate(pageOptionsDto);
    return items.toPageDto(pageMetaDto);
  }

  async getAllCanceled(
    pageOptionsDto: CanceledOrderPageOptionDto,
  ): Promise<PageDto<OrderDto>> {
    const result =
      this.orderCancelReasonRepository.createQueryBuilder('orderCanceled');

    if (pageOptionsDto.customerId) {
      result.where('orderCanceled.customer_id = :customerId', {
        customerId: pageOptionsDto.customerId,
      });
    }

    const orderBy = pageOptionsDto?.orderBy || 'createdAt';

    const [items, pageMetaDto] = await result
      .orderBy(`orderCanceled.${orderBy}`, pageOptionsDto.order)
      .paginate(pageOptionsDto);
    return items.toPageDto(pageMetaDto);
  }

  async getOrdersHistory(
    id: Uuid,
    pageOptionsDto: OrderHistoryPageOptionDto,
  ): Promise<PageDto<OrderHistoryDto>> {
    const result = this.orderHistoryRepository
      .createQueryBuilder('orderHistory')
      .where('orderHistory.customerId = :id', { id });

    const orderBy = pageOptionsDto?.orderBy || 'createdAt';

    const [items, pageMetaDto] = await result
      .orderBy(`orderHistory.${orderBy}`, pageOptionsDto.order)
      .paginate(pageOptionsDto);
    return items.toPageDto(pageMetaDto);
  }

  async findOne(id: Uuid): Promise<OrderDto> {
    const orderEntity = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'products')
      .where('order.id = :id', { id })
      .getOne();

    if (!orderEntity) {
      throw new OrderNotFound();
    }

    return orderEntity.toDto();
  }

  @Transactional()
  async updateStatus(
    id: Uuid,
    updateOrderStatus: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    if (
      updateOrderStatus.status === OrderStatusEnum.PENDING ||
      updateOrderStatus.status === OrderStatusEnum.CANCELED
    ) {
      throw new InvalidTransactionStatusException();
    }

    const orderEntity = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'products')
      .where('order.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('order.status = :status1', {
            status1: OrderStatusEnum.PENDING,
          }).orWhere('order.status = :status2', {
            status2: OrderStatusEnum.ACCEPTED,
          });
        }),
      )
      .getOne();

    if (!orderEntity) {
      throw new OrderNotFound();
    }

    this.orderRepository.merge(orderEntity, {
      status: updateOrderStatus.status,
    });

    await this.orderRepository.save(orderEntity);

    if (updateOrderStatus.status === OrderStatusEnum.COMPLETED) {
      const products = orderEntity.orderProducts.map((product) => {
        return {
          productName: product.product.productName,
          quantity: product.quantity,
        };
      });
      const orderHistory = this.orderHistoryRepository.create({
        amount: orderEntity.amount,
        customerId: orderEntity.customer_id,
        products,
      });

      await this.orderHistoryRepository.save(orderHistory);
    }

    this.eventsNotificationService.sendOrderStatusUpdatedEvent([
      orderEntity.customer_id,
    ]);
    return orderEntity.toDto();
  }

  @Transactional()
  async cancelOrder(
    id: Uuid,
    role: RoleTypeEnum,
    userId: Uuid,
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
      userId,
      reason: createOrderCancelReasonDto.reason,
    });

    await this.orderCancelReasonRepository.save(reasonEntity);

    this.eventsNotificationService.sendOrderCanceledEvent([userId]);

    return {
      id: reasonEntity.id,
      status: orderEntity.status,
      reason: createOrderCancelReasonDto.reason,
    };
  }

  async delete(id: Uuid): Promise<void> {
    await this.orderRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .delete()
      .execute();
  }

  async deleteHistory(id: Uuid, customerId: Uuid): Promise<void> {
    await this.orderHistoryRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('customerId = :customerId', { customerId })
      .delete()
      .execute();
  }

  async deleteCanceledOrders() {
    await this.orderRepository
      .createQueryBuilder()
      .where("updatedAt <= NOW() - INTERVAL '10 minutes'")
      // .where("updatedAt <= NOW() - INTERVAL '24 hours'")
      .andWhere('status = :status', { status: OrderStatusEnum.CANCELED })
      .delete()
      .execute();
  }
}
