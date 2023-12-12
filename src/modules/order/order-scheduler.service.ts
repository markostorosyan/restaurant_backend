import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from './order.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderSchedulerService {
  constructor(private orderService: OrderService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async deleteCanceledOrders() {
    void this.orderService.deleteCanceledOrders();
  }
}
