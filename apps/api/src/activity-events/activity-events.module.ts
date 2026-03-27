import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityEventsController } from './activity-events.controller';
import { CreateActivityEventHandler } from './commands/create-activity-event.handler';
import { FindActivityEventsHandler } from './queries/find-activity-events.handler';

@Module({
  controllers: [ActivityEventsController],
  providers: [PrismaService, CreateActivityEventHandler, FindActivityEventsHandler],
})
export class ActivityEventsModule {}
