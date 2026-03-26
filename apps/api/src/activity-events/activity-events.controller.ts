import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
import { ActivityEventsService } from './activity-events.service';
import { CreateActivityEventDto } from './dto/create-activity-event.dto';
import { FindEventsInputDto } from './dto/find-events-input.dto';

@ApiTags('sessions')
@Controller('sessions/:sessionId')
export class ActivityEventsController {
  constructor(private readonly activityEventsService: ActivityEventsService) {}

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
    return this.activityEventsService.createActivityEvent(sessionId, createActivityEventDto);
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
    name: 'from',
    required: false,
    description: 'Start date',
  })
  @ApiQuery({
    type: String,
    name: 'to',
    required: false,
    description: 'End date',
  })
  @ApiQuery({
    type: String,
    name: 'eventType',
    required: false,
    description: 'Event type',
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
