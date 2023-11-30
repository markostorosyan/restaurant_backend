import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductModule } from '../product/product.module';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderCancelReasonEntity } from './entities/order-cancel-reason.entity';
import { OrderHistoryEntity } from './entities/order-history.entity';

@Module({
  imports: [
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderProductEntity,
      OrderHistoryEntity,
      OrderCancelReasonEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
