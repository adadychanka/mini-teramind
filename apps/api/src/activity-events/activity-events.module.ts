import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityEventsController } from './activity-events.controller';
import { ActivityEventsService } from './activity-events.service';
import { CreateActivityEventHandler } from './commands/create-activity-event.handler';

@Module({
  controllers: [ActivityEventsController],
  providers: [ActivityEventsService, PrismaService, CreateActivityEventHandler],
})
export class ActivityEventsModule {}
