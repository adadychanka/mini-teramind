import { Controller, Get, Param, Patch } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SessionStatus, type SessionDto } from '@repo/contracts';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './sessions.service';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'End a session' })
  @ApiOkResponse({
    description:
      'Session ended successfully. If the session is already ended, the existing session is returned.',
  })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async endSession(@Param('id') id: string): Promise<SessionDto> {
    const updateSessionDto: UpdateSessionDto = {
      id,
      status: SessionStatus.ENDED,
      endedAt: new Date().toISOString(),
    };

    return await this.sessionsService.endSession(updateSessionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiOkResponse({ description: 'Session retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<SessionDto> {
    return await this.sessionsService.findSessionById(id);
  }
}
