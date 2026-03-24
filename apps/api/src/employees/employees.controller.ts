import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
import { type EmployeeDto, type PaginationOutputDto } from '@repo/contracts';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an employee' })
  @ApiCreatedResponse({ description: 'Employee created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiConflictResponse({ description: 'Employee with this email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
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
    description: 'Number of employees per page',
    default: 100,
  })
  @ApiOkResponse({ description: 'Employees retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query() paginationInputDto: PaginationQueryDto,
  ): Promise<PaginationOutputDto<EmployeeDto>> {
    return await this.employeesService.findAll(paginationInputDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiOkResponse({ description: 'Employee retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    return await this.employeesService.findOne(id);
  }
}
