import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRuleDto } from './dto/create-rule.dto';
import { FindRulesInputDto } from './dto/find-rules-input.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RulesService } from './rules.service';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiCreatedResponse({ description: 'Rule created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rules' })
  @ApiOkResponse({ description: 'Rules retrieved successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of rules per page',
    default: 10,
  })
  @ApiQuery({
    name: 'active',
    type: Boolean,
    required: false,
    description: 'Filter rules by active status',
    default: true,
  })
  async findAll(@Query() findRulesInputDto: FindRulesInputDto) {
    return this.rulesService.findAll(findRulesInputDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule' })
  @ApiOkResponse({ description: 'Rule updated successfully' })
  @ApiNotFoundResponse({ description: 'Rule not found' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(id, updateRuleDto);
  }
}
