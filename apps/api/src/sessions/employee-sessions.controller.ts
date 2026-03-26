import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { type PaginationOutputDto, type SessionDto } from '@repo/contracts';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsService } from './sessions.service';

@ApiTags('employees')
@Controller('employees/:employeeId/sessions')
export class EmployeeSessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a session for an employee' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiCreatedResponse({ description: 'Session created successfully' })
  @ApiConflictResponse({ description: 'Employee already has an active session' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createSession(@Param('employeeId') employeeId: string): Promise<SessionDto> {
    const createSessionDto: CreateSessionDto = { employeeId };

    return this.sessionsService.startSessionForEmployee(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions for an employee' })
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
    description: 'Number of sessions per page',
    default: 100,
  })
  @ApiOkResponse({ description: 'Sessions retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getSessions(
    @Param('employeeId') employeeId: string,
    @Query() paginationInputDto: PaginationQueryDto,
  ): Promise<PaginationOutputDto<SessionDto>> {
    return this.sessionsService.findAllSessionsByEmployeeId(employeeId, paginationInputDto);
  }
}
