import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiCreatedResponse({ description: 'Employee created successfully' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Employees retrieved successfully' })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Employee retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }
}
