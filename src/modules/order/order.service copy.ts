// // import _ from 'lodash';
// import { Injectable } from '@nestjs/common';
// import { CreateOrderArrayDto } from './dto/create-order.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { OrderEntity } from './entities/order.entity';
// import { Repository } from 'typeorm';
// import { Transactional } from 'typeorm-transactional';
// import { ProductService } from '../product/product.service';
// import { TotalOrdersEntity } from './entities/total-orders.entity';
// import { TotalOrdersDto } from './dto/total-orders.dto';
// import { OrderPageOptionDto } from './dto/order-page-option.dto';
// import { YourCartIsEmptyExceptions } from './exceptions/your-cart-is-empty.exception';
// import { CreateTotalOrdersDto } from './dto/create-total-orders.dto';
// import { DeletedTotalOrders } from './dto/deleted-total-orders.dto';
// import { TotalOrdersNotFound } from './exceptions/total-oreders-not-found.exception';
// import { TotalOrdersEnum } from '../../constants/total-orders-status.enum';
// import { TotalOrdersStatusChangedException } from './exceptions/total-orders-status-changed.exception';
// import { UpdateTotalOrdersDto } from './dto/update-total-orders.dto';
// import { AccessDeniedException } from '../../exception/access-denied.exception';

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectRepository(OrderEntity)
//     private orderRepository: Repository<OrderEntity>,
//     @InjectRepository(TotalOrdersEntity)
//     private totalOrdersRepository: Repository<TotalOrdersEntity>,
//     private productService: ProductService,
//   ) {}

//   @Transactional()
//   async create(
//     customerId: Uuid,
//     createOrderArrayDto: CreateOrderArrayDto,
//   ): Promise<TotalOrdersDto> {
//     // if (_.isEmpty(createOrderArrayDto.orders)) {
//     //   throw new YourCartIsEmptyExceptions();
//     // }

//     if (createOrderArrayDto.orders.length < 1) {
//       throw new YourCartIsEmptyExceptions();
//     }

//     const formattedTotal = await this.productService.priceMultiplyQuantity(
//       createOrderArrayDto,
//       customerId,
//     );

//     const totalOrdersEntity = this.totalOrdersRepository.create({
//       customer_id: customerId,
//     });

//     await this.totalOrdersRepository.save(totalOrdersEntity);

//     const createTotalOrdersArray = [];

//     for (const formatted of formattedTotal) {
//       createTotalOrdersArray.push(
//         this.createTotalOrders(totalOrdersEntity.id, formatted),
//       );
//     }

//     const totalOrdersEntities = await Promise.all(createTotalOrdersArray);

//     // taki save imast voorna?
//     await this.orderRepository.save(totalOrdersEntities);

//     const total: number = totalOrdersEntities.reduce(
//       (first, entity) => first + entity.total,
//       0,
//     );

//     this.totalOrdersRepository.merge(totalOrdersEntity, { total });

//     await this.totalOrdersRepository.save(totalOrdersEntity);

//     return totalOrdersEntity.toDto();
//   }

//   async createTotalOrders(totalId: Uuid, order: CreateTotalOrdersDto) {
//     const orderEntity = this.orderRepository.create({
//       ...order,
//       total_order_id: totalId,
//       product_id: order.productId,
//     });
//     await this.orderRepository.save(orderEntity);

//     return orderEntity;
//   }

//   async findAll(id: Uuid, pageOptionsDto?: OrderPageOptionDto) {
//     const result = await this.totalOrdersRepository
//       .createQueryBuilder('totalOrder')
//       // relations-nery pti grvi
//       .leftJoinAndSelect('totalOrder.ordersId', 'order')
//       .leftJoinAndSelect('order.products', 'products')
//       .where('totalOrder.customer_id = :customerId', { customerId: id });
//     const orderBy = pageOptionsDto?.orderBy || 'createdAt';

//     const [items, pageMetaDto] = await result
//       .orderBy(`totalOrder.${orderBy}`, pageOptionsDto.order)
//       .paginate(pageOptionsDto);

//     return items.toPageDto(pageMetaDto);
//   }

//   async findOne(id: Uuid) {
//     const totalOrdersEntity = await this.totalOrdersRepository
//       .createQueryBuilder('totalOrder')
//       .leftJoinAndSelect('totalOrder.ordersId', 'order')
//       .leftJoinAndSelect('order.products', 'products')
//       .where('totalOrder.id = :id', { id })
//       .getOne();

//     if (!totalOrdersEntity) {
//       throw new TotalOrdersNotFound();
//     }

//     return totalOrdersEntity;
//   }

//   async deleteProductFromOrder(
//     id: Uuid,
//     customerId: Uuid,
//     createOrderArrayDto: UpdateTotalOrdersDto,
//   ) {
//     const totalOrdersEntity = await this.findOne(id);

//     console.log(createOrderArrayDto, '++++');
//     console.log('++++', totalOrdersEntity.ordersId, '-------');

//     const test = totalOrdersEntity.ordersId;
//     // const { quantity, total, products } = test;

//     // console.log(quantity, '121', total, '741', products)

//     for (const a of test) {
//       const { quantity, total, products } = a;

//     console.log(quantity, '121', total, '741', products)
//     }


//     // const deleteOrReduceOrder = [];

//     // for (const order of totalOrdersEntity.orders) {
//     //   // deleteOrReduceOrder.push(this.productService.)
//     //   console.log(order, '0000000000');
//     //   console.log(order.product_id, '======');
//     // }
//     if (!totalOrdersEntity) {
//       throw new TotalOrdersNotFound();
//     }

//     if (totalOrdersEntity.customer_id !== customerId) {
//       throw new AccessDeniedException();
//     }

//     if (totalOrdersEntity.status !== TotalOrdersEnum.PENDING) {
//       throw new TotalOrdersStatusChangedException();
//     }
//   }

//   async addProductToOrder(
//     id: Uuid,
//     customerId: Uuid,
//     createOrderArrayDto: UpdateTotalOrdersDto,
//   ) {
//     const totalOrdersEntity = await this.totalOrdersRepository
//       .createQueryBuilder('totalOrder')
//       .where('totalOrder.id = :id', { id })
//       .andWhere('totalOrder.status = :status', {
//         status: TotalOrdersEnum.PENDING,
//       })
//       .getOne();

//     if (!totalOrdersEntity) {
//       throw new TotalOrdersNotFound();
//     }

//     if (totalOrdersEntity.customer_id !== customerId) {
//       throw new AccessDeniedException();
//     }

//     if (totalOrdersEntity.status !== TotalOrdersEnum.PENDING) {
//       throw new TotalOrdersStatusChangedException();
//     }

//     const formattedTotal = await this.productService.priceMultiplyQuantity(
//       createOrderArrayDto,
//       customerId,
//     );

//     const createArray = [];

//     for (const formatted of formattedTotal) {
//       createArray.push(this.createTotalOrders(totalOrdersEntity.id, formatted));
//     }

//     const totalOrdersEntities = await Promise.all(createArray);

//     await this.orderRepository.save(totalOrdersEntities);

//     const total: number = totalOrdersEntities.reduce(
//       (first, entity) => first + entity.total,
//       totalOrdersEntity.total,
//     );

//     this.totalOrdersRepository.merge(totalOrdersEntity, { total });

//     await this.totalOrdersRepository.save(totalOrdersEntity);

//     // after test add toDto()
//     return totalOrdersEntity;
//     // await this.totalOrdersRepository.merge(totalOrdersEntity, updateOrderDto)
//   }

//   async remove(id: Uuid): Promise<DeletedTotalOrders> {
//     await this.totalOrdersRepository
//       .createQueryBuilder()
//       .where('id = :id', { id })
//       .delete()
//       .execute();

//     return { id };
//   }
// }
