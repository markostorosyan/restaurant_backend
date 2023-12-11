import { Module } from '@nestjs/common';
import { EventsGateway } from './events-gateway';
import { EventsNotificationService } from './events-notification.service';

@Module({
  providers: [EventsGateway, EventsNotificationService],
  exports: [EventsNotificationService, EventsGateway],
})
export class EventsModule {}
