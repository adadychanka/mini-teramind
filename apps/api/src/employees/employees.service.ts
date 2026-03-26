import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeDto, type PaginationOutputDto } from '@repo/contracts';
import { normalizeEmail } from 'src/common/email/normalize-email';
import {
  isFieldError,
  isUniqueConstraintViolationError,
} from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { DEFAULT_EMPLOYEES_PER_PAGE } from './employees.constants';
import { toEmployeeDto } from './employees.mapper';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
    try {
      const result = await this.prisma.employee.create({
        data: {
          name: createEmployeeDto.name,
          email: normalizeEmail(createEmployeeDto.email),
          department: createEmployeeDto.department,
        },
      });

      return toEmployeeDto(result);
    } catch (error) {
      // Validate unique constraint violation errors
      if (isUniqueConstraintViolationError(error)) {
        const isEmailFieldViolation = isFieldError(error, 'email');

        if (isEmailFieldViolation) {
          throw new ConflictException('Employee with this email already exists');
        }

        throw new ConflictException('Unique constraint violation');
      }

      // Re-throw other errors
      throw error;
    }
  }

  async findAll(paginationInputDto: PaginationQueryDto): Promise<PaginationOutputDto<EmployeeDto>> {
    const { page = 1, limit = DEFAULT_EMPLOYEES_PER_PAGE } = paginationInputDto;

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.employee.count(),
    ]);
    const employeeDtos = employees.map(toEmployeeDto);

    const hasNextPage = page * limit < total;

    return {
      items: employeeDtos,
      total,
      hasNextPage,
    };
  }

  async findOne(id: string): Promise<EmployeeDto> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return toEmployeeDto(employee);
  }
}
