import { Injectable } from '@nestjs/common';
import { EmployeeDto, type PaginationInputDto, type PaginationOutputDto } from '@repo/contracts';
import { CreateEmployeeDto } from './dto/create-employee.dto';

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
  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDto> {
    // throw ConflictException if employee already exists
    // throw new ConflictException(`Employee already exists`);
    return Promise.resolve(mockEmployee);
  }

  async findAll(paginationInputDto: PaginationInputDto): Promise<PaginationOutputDto<EmployeeDto>> {
    return Promise.resolve({
      items: [mockEmployee],
      total: 1,
      hasNextPage: false,
    });
  }

  async findOne(id: number): Promise<EmployeeDto> {
    // throw NotFoundException if employee not found
    // throw new NotFoundException(`Employee not found`);
    return Promise.resolve(mockEmployee);
  }
}
