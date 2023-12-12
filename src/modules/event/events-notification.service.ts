import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events-gateway';
import { OrderEventsWsEnum } from 'src/constants/order-events-ws.enum';

@Injectable()
export class EventsNotificationService {
  constructor(private eventsGateway: EventsGateway) {}

  sendOrderCanceledEvent(rooms: Uuid[]) {
    this.eventsGateway.to(rooms).emit(OrderEventsWsEnum.CANCELED);
  }

  sendOrderCreatedEvent(rooms: Uuid[]) {
    this.eventsGateway.to(rooms).emit(OrderEventsWsEnum.CREATED);
  }

  sendOrderStatusUpdatedEvent(rooms: Uuid[]) {
    this.eventsGateway.to(rooms).emit(OrderEventsWsEnum.UPDATED);
  }
}
