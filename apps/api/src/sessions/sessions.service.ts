import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOutputDto, SessionDto, SessionStatus } from '@repo/contracts';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { toSessionDto } from './sessions.mapper';

const mockedSession: SessionDto = {
  id: '1',
  employeeId: '1',
  startedAt: new Date().toISOString(),
  endedAt: null,
  status: SessionStatus.ACTIVE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto): Promise<SessionDto> {
    return Promise.resolve({
      ...mockedSession,
      employeeId: createSessionDto.employeeId,
    });
  }

  async end(updateSessionDto: UpdateSessionDto): Promise<SessionDto> {
    return Promise.resolve({
      ...mockedSession,
      ...updateSessionDto,
    });
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

    const sessions = await this.prisma.session.findMany({
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
    });

    const sessionDtos = sessions.map(toSessionDto);
    const total = await this.prisma.session.count({
      where: {
        employeeId,
      },
    });
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
  async findOne(sessionId: string): Promise<SessionDto> {
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
