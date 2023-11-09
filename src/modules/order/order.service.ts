import { Injectable } from '@nestjs/common';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ProductService } from '../product/product.service';
import { TotalOrdersEntity } from './entities/total-orders.entity';
import { TotalOrdersDto } from './dto/total-orders.dto';
import { OrderTotalOrderEntity } from './entities/order-total-order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(TotalOrdersEntity)
    private totalOrdersRepository: Repository<TotalOrdersEntity>,
    @InjectRepository(OrderTotalOrderEntity)
    private orderTotalOrderRepository: Repository<OrderTotalOrderEntity>,
    private productService: ProductService,
  ) {}

  // async create(createOrderArrayDto: CreateOrderArrayDto) {
  //   const ordersIdArray = [];
  //   for (const order of createOrderArrayDto.orders) {
  //     const orderEntity = this.orderRepository.create(order);
  //     console.log(orderEntity.id);
  //     ordersIdArray.push(orderEntity.id);
  //   }

  //   await this.orderRepository.save(createOrderArrayDto.orders);

  //   // push someArray all orders id and save
  //   return ordersIdArray;
  // }
  @Transactional()
  async create(
    userId: Uuid,
    createOrderArrayDto: CreateOrderArrayDto,
  ): Promise<TotalOrdersDto> {
    const formattedTotal = await this.productService.priceMultiplyQuantity(
      createOrderArrayDto,
      userId,
    );

    const orderEntities = this.orderRepository.create(formattedTotal);

    await this.orderRepository.save(orderEntities);

    const ids: Uuid[] = [];

    const total: number = orderEntities.reduce(
      (first, entity) => first + entity.total,
      0,
    );

    for (const entity of orderEntities) {
      ids.push(entity.id);
    }

    const totalOrdersEntity = this.totalOrdersRepository.create({
      total: parseFloat(total.toFixed(2)),
      orderId: ids,
      customer_id: userId,
    });

    await this.totalOrdersRepository.save(totalOrdersEntity);

    // need think
    // const orderTotalOrderEntity = this.orderTotalOrderRepository.create({ order: orderEntities.})

    return totalOrdersEntity.toDto();
  }

  async findAll(id: Uuid) {
    const totalOrders = await this.totalOrdersRepository
      .createQueryBuilder('total')
      .innerJoinAndSelect('total.customer', 'customer')
      .innerJoinAndSelect('total.orderId', 'order')
      .innerJoinAndSelect('order.product', 'product')
      .where('customer.id = :id', { id })
      .getMany();

    return totalOrders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
