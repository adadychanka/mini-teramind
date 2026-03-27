import { Query } from '@nestjs/cqrs';
import { ActivityEventDto, PaginationOutputDto } from '@repo/contracts';
import { ActivityEventType } from 'generated/prisma/enums';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { FindEventsInputDto } from '../dto/find-events-input.dto';

export type FindActivityEventsQueryResult = PaginationOutputDto<ActivityEventDto>;

export class FindActivityEventsQuery extends Query<FindActivityEventsQueryResult> {
  constructor(
    public readonly payload: {
      sessionId: string;
      from?: FindEventsInputDto['from'];
      to?: FindEventsInputDto['to'];
      eventType?: ActivityEventType;
      pagination: PaginationQueryDto;
    },
  ) {
    super();
  }
}
