import { Injectable } from '@nestjs/common';
import { EmployeeDto, type PaginationOutputDto } from '@repo/contracts';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { DEFAULT_EMPLOYEES_PER_PAGE } from './employees.constants';
import { toEmployeeDto } from './employees.mapper';

const mockEmployee: EmployeeDto = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'IT',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
    // throw ConflictException if employee already exists
    // throw new ConflictException(`Employee already exists`);
    return Promise.resolve(mockEmployee);
  }

  async findAll(paginationInputDto: PaginationQueryDto): Promise<PaginationOutputDto<EmployeeDto>> {
    const { page = 1, limit = DEFAULT_EMPLOYEES_PER_PAGE } = paginationInputDto;

    const skip = (page - 1) * limit;

    const employees = await this.prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
    });
    const employeeDtos = employees.map(toEmployeeDto);

    const total = await this.prisma.employee.count();
    const hasNextPage = page * limit < total;

    return {
      items: employeeDtos,
      total,
      hasNextPage,
    };
  }

  async findOne(id: number): Promise<EmployeeDto> {
    // throw NotFoundException if employee not found
    // throw new NotFoundException(`Employee not found`);
    return Promise.resolve(mockEmployee);
  }
}
