import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from 'generated/prisma/client';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { PrismaService } from 'src/prisma/prisma.service';
import { toActivityEventDto } from '../activity-events.mapper';
import {
  FindActivityEventsQuery,
  FindActivityEventsQueryResult,
} from './find-activity-events.query';

@QueryHandler(FindActivityEventsQuery)
export class FindActivityEventsHandler implements IQueryHandler<FindActivityEventsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindActivityEventsQuery): Promise<FindActivityEventsQueryResult> {
    const {
      sessionId,
      from,
      to,
      eventType,
      pagination: { page = 1, limit = DEFAULT_PAGINATION_LIMIT },
    } = query.payload;

    const skip = (page - 1) * limit;

    if (!sessionId) {
      throw new NotFoundException('Session not found');
    }

    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const where: Prisma.ActivityEventWhereInput = {
      sessionId,
      occurredAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
      type: eventType ? { equals: eventType } : undefined,
    };
    const [activityEvents, total] = await Promise.all([
      this.prisma.activityEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          occurredAt: 'desc',
        },
        select: {
          id: true,
          type: true,
          metadata: true,
          sessionId: true,
          occurredAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.activityEvent.count({
        where,
      }),
    ]);

    const activityEventDtos = activityEvents.map(toActivityEventDto);
    const hasNextPage = page * limit < total;

    return {
      items: activityEventDtos,
      total,
      hasNextPage,
    };
  }
}
