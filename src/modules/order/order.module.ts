import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductModule } from '../product/product.module';
import { TotalOrdersEntity } from './entities/total-orders.entity';
import { OrderTotalOrderEntity } from './entities/order-total-order.entity';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([
      OrderEntity,
      TotalOrdersEntity,
      OrderTotalOrderEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
