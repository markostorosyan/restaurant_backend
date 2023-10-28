import { Injectable } from '@nestjs/common';
import { CreateOrderArrayDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
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
  async create(userId: Uuid, createOrderArrayDto: CreateOrderArrayDto) {
    // const productTotalPrice =
    const createPromises = createOrderArrayDto.orders.map(async (order) => {
      const orderEntity = this.orderRepository.create({
        ...order,
        customer_id: userId,
      });
      return this.orderRepository.save(orderEntity);
    });

    const savedOrders = await Promise.all(createPromises);

    const ordersIdArray = savedOrders.map((order) => order.id);

    return ordersIdArray;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  // inchna update anelu
  // max dimi update avelacnelu hamar kame ete araqum ka hascen poxelu hamar
  // et case hamar nor entity vortegh pahme order-neri uuid[]
  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
