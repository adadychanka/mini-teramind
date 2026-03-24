import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOutputDto, SessionDto, SessionStatus } from '@repo/contracts';
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

  async findAllSessionsByEmployeeId(
    employeeId: string,
    paginationInputDto: PaginationQueryDto,
  ): Promise<PaginationOutputDto<SessionDto>> {
    return Promise.resolve({
      items: [
        {
          ...mockedSession,
          employeeId,
        },
      ],
      total: 1,
      hasNextPage: false,
    });
  }

  async findOne(sessionId: string): Promise<SessionDto> {
    const session = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return toSessionDto(session);
  }
}
