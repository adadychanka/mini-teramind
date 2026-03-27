import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ActivityEventType } from 'generated/prisma/enums';
import { ActivityEventsService } from './activity-events.service';
import { CreateActivityEventCommand } from './commands/create-activity-event.command';
import { CreateActivityEventDto } from './dto/create-activity-event.dto';
import { FindEventsInputDto } from './dto/find-events-input.dto';

@ApiTags('sessions')
@Controller('sessions/:sessionId')
export class ActivityEventsController {
  constructor(
    private readonly activityEventsService: ActivityEventsService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('events')
  @ApiOperation({ summary: 'Create an activity event for a session' })
  @ApiCreatedResponse({ description: 'Activity event created successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(
    @Param('sessionId') sessionId: string,
    @Body() createActivityEventDto: CreateActivityEventDto,
  ) {
    return this.commandBus.execute(
      new CreateActivityEventCommand({
        sessionId,
        type: createActivityEventDto.type,
        occurredAt: createActivityEventDto.occurredAt,
        metadata: createActivityEventDto.metadata,
      }),
    );
  }

  @Get('events')
  @ApiOperation({ summary: 'Get all activity events for a session' })
  @ApiQuery({
    type: Number,
    name: 'page',
    required: true,
    description: 'Page number',
    default: 1,
  })
  @ApiQuery({
    type: Number,
    name: 'limit',
    required: true,
    description: 'Number of activity events per page',
    default: 100,
  })
  @ApiQuery({
    type: String,
    format: 'date-time',
    name: 'from',
    required: false,
    description: 'Start date',
    example: '2026-03-26T10:00:00Z',
  })
  @ApiQuery({
    type: String,
    format: 'date-time',
    name: 'to',
    required: false,
    description: 'End date',
    example: '2026-03-26T10:00:00Z',
  })
  @ApiQuery({
    type: String,
    enum: ActivityEventType,
    name: 'eventType',
    required: false,
    description: 'The type of activity event to filter by',
    example: 'APP',
  })
  @ApiOkResponse({ description: 'Activity events retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Param('sessionId') sessionId: string,
    @Query() findEventsInputDto: FindEventsInputDto,
  ) {
    return this.activityEventsService.findAllActivityEvents(sessionId, findEventsInputDto);
  }
}
