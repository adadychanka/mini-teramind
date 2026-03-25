import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityEventsController } from './activity-events.controller';
import { ActivityEventsService } from './activity-events.service';

@Module({
  controllers: [ActivityEventsController],
  providers: [ActivityEventsService, PrismaService],
})
export class ActivityEventsModule {}
