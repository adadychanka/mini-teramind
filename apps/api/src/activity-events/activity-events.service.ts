import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityEventDto, PaginationOutputDto } from '@repo/contracts';
import { Prisma } from 'generated/prisma/client';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { isForeignKeyConstraintViolationError } from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { toActivityEventDto } from './activity-events.mapper';
import { CreateActivityEventDto } from './dto/create-activity-event.dto';
import { FindEventsInputDto } from './dto/find-events-input.dto';

@Injectable()
export class ActivityEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createActivityEvent(
    sessionId: string,
    createActivityEventDto: CreateActivityEventDto,
  ): Promise<ActivityEventDto> {
    const existingSession = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
      },
    });
    if (!existingSession) {
      throw new NotFoundException('Session not found');
    }

    try {
      const activityEvent = await this.prisma.activityEvent.create({
        data: {
          type: createActivityEventDto.type,
          metadata: createActivityEventDto.metadata as Prisma.JsonObject,
          occurredAt: createActivityEventDto.occurredAt,
          sessionId: sessionId,
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
      });

      return toActivityEventDto(activityEvent);
    } catch (error) {
      if (isForeignKeyConstraintViolationError(error)) {
        throw new NotFoundException('Session not found');
      }
      throw error;
    }
  }

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
