import { Injectable } from '@nestjs/common';
import { PaginationOutputDto } from '@repo/contracts';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityEventDto } from './dto/create-activity-event.dto';

@Injectable()
export class ActivityEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createActivityEvent(
    sessionId: string,
    createActivityEventDto: CreateActivityEventDto,
  ): Promise<object> {
    return Promise.resolve({});
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
