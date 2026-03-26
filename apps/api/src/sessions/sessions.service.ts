import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginationOutputDto, SessionDto, SessionStatus } from '@repo/contracts';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import {
  isForeignKeyConstraintViolationError,
  isRecordNotFoundError,
  isUniqueConstraintViolationError,
} from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { createActiveSession, createEndedSession, isEndedSession } from './sessions.helpers';
import { toSessionDto } from './sessions.mapper';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new session for an employee.
   * @param createSessionDto - The create session dto.
   * @returns The session dto.
   * @throws NotFoundException if the employee is not found.
   * @throws ConflictException if the employee already has an active session.
   */
  async startSessionForEmployee(createSessionDto: CreateSessionDto): Promise<SessionDto> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: createSessionDto.employeeId,
      },
      select: {
        id: true,
      },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const activeSession = createActiveSession(createSessionDto);
    try {
      const session = await this.prisma.session.create({
        data: {
          ...activeSession,
        },
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employeeId: true,
        },
      });

      return toSessionDto(session);
    } catch (error) {
      if (isUniqueConstraintViolationError(error)) {
        throw new ConflictException('Employee already has an active session');
      }
      if (isForeignKeyConstraintViolationError(error)) {
        throw new NotFoundException('Employee not found');
      }

      throw error;
    }
  }

  /**
   * End a session.
   * @param updateSessionDto - The update session dto.
   * @returns The session dto. If the session is already ended, the existing session is returned.
   * @throws NotFoundException if the session is not found.
   */
  async endSession(updateSessionDto: UpdateSessionDto): Promise<SessionDto> {
    try {
      const endedSessionInput = createEndedSession(updateSessionDto);
      const updatedSession = await this.prisma.session.update({
        where: {
          id: updateSessionDto.id,
          status: SessionStatus.ACTIVE,
        },
        data: endedSessionInput,
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employeeId: true,
        },
      });

      return toSessionDto(updatedSession);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        const alreadyEndedSession = await this.prisma.session.findUnique({
          where: {
            id: updateSessionDto.id,
          },
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            employeeId: true,
          },
        });
        if (!alreadyEndedSession) {
          throw new NotFoundException(`Session ${updateSessionDto.id} not found`);
        }

        // If the session is already ended, return the existing session.
        if (isEndedSession(alreadyEndedSession)) {
          return toSessionDto(alreadyEndedSession);
        }

        throw new InternalServerErrorException('Failed to end session', {
          cause: error,
        });
      }

      throw error;
    }
  }

  /**
   * Get all sessions for an employee.
   * @param employeeId - The ID of the employee to get the sessions for.
   * @param paginationInputDto - The pagination input dto.
   * @returns The pagination output dto.
   * @throws NotFoundException if the employee is not found.
   */
  async findAllSessionsByEmployeeId(
    employeeId: string,
    paginationInputDto: PaginationQueryDto,
  ): Promise<PaginationOutputDto<SessionDto>> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
      select: {
        id: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT } = paginationInputDto;
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      this.prisma.session.findMany({
        where: {
          employeeId,
        },
        skip,
        take: limit,
        orderBy: {
          startedAt: 'desc',
        },
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          employeeId: true,
        },
      }),
      this.prisma.session.count({
        where: {
          employeeId,
        },
      }),
    ]);

    const sessionDtos = sessions.map(toSessionDto);
    const hasNextPage = page * limit < total;
    return {
      items: sessionDtos,
      total,
      hasNextPage,
    };
  }

  /**
   * Get a session by ID.
   * @param sessionId - The ID of the session to get.
   * @returns The session dto.
   * @throws NotFoundException if the session is not found.
   */
  async findSessionById(sessionId: string): Promise<SessionDto> {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
        startedAt: true,
        endedAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        employeeId: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return toSessionDto(session);
  }
}
