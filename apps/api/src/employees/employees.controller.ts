import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  type EmployeeDto,
  type PaginationInputDto,
  type PaginationOutputDto,
} from '@repo/contracts';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Employee created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true, default: 1 })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    description: 'Number of employees per page',
    default: 100,
  })
  @ApiOkResponse({ description: 'Employees retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findAll(
    @Query() paginationInputDto: PaginationInputDto,
  ): Promise<PaginationOutputDto<EmployeeDto>> {
    return await this.employeesService.findAll(paginationInputDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Employee retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(@Param('id') id: string) {
    return await this.employeesService.findOne(+id);
  }
}
