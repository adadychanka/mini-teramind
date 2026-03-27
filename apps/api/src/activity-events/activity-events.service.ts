import { Injectable } from '@nestjs/common';
import { ActivityEventDto, PaginationOutputDto } from '@repo/contracts';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { PrismaService } from 'src/prisma/prisma.service';
import { toActivityEventDto } from './activity-events.mapper';
import { FindEventsInputDto } from './dto/find-events-input.dto';

@Injectable()
export class ActivityEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActivityEvents(
    sessionId: string,
    paginationInputDto: FindEventsInputDto,
  ): Promise<PaginationOutputDto<ActivityEventDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT, from, to, eventType } = paginationInputDto;
    const skip = (page - 1) * limit;

    const [activityEvents, total] = await Promise.all([
      this.prisma.activityEvent.findMany({
        where: {
          sessionId,
          occurredAt: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
          type: eventType
            ? {
                equals: eventType,
              }
            : undefined,
        },
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
        where: {
          sessionId,
          occurredAt: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
          type: eventType
            ? {
                equals: eventType,
              }
            : undefined,
        },
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
