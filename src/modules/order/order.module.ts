import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ProductModule } from '../product/product.module';
import { OrderProductEntity } from './entities/order-product.entity';
import { OrderCancelReasonEntity } from './entities/order-cancel-reason.entity';
import { OrderHistoryEntity } from './entities/order-history.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsModule } from '../event/events.module';
import { OrderSchedulerService } from './order-scheduler.service';

@Module({
  imports: [
    forwardRef(() => EventsModule),
    forwardRef(() => ProductModule),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderProductEntity,
      OrderHistoryEntity,
      OrderCancelReasonEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderSchedulerService],
})
export class OrderModule {}
