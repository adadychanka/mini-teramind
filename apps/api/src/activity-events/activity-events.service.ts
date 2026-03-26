import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityEventDto, PaginationOutputDto } from '@repo/contracts';
import { Prisma } from 'generated/prisma/client';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { isForeignKeyConstraintViolationError } from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { toActivityEventDto } from './activity-events.mapper';
import { CreateActivityEventDto } from './dto/create-activity-event.dto';

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
    paginationInputDto: PaginationQueryDto,
  ): Promise<PaginationOutputDto<object>> {
    return Promise.resolve({
      items: [],
      total: 0,
      hasNextPage: false,
    } satisfies PaginationOutputDto<object>);
  }
}
