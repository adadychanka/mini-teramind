import { Injectable } from '@nestjs/common';
import { PaginationOutputDto, RuleDto, RuleSeverity } from '@repo/contracts';
import { RuleType } from 'generated/prisma/enums';
import { CreateRuleDto } from './dto/create-rule.dto';
import { FindRulesInputDto } from './dto/find-rules-input.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

const mockedRuleDto = {
  id: '1',
  name: 'Rule 1',
  type: RuleType,
  severity: RuleSeverity,
  config: {},
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as unknown as RuleDto;

@Injectable()
export class RulesService {
  create(createRuleDto: CreateRuleDto): Promise<RuleDto> {
    return Promise.resolve(mockedRuleDto);
  }

  findAll(findRulesInputDto: FindRulesInputDto): Promise<PaginationOutputDto<RuleDto>> {
    return Promise.resolve({
      items: [mockedRuleDto],
      total: 1,
      hasNextPage: false,
    });
  }

  update(ruleId: string, updateRuleDto: UpdateRuleDto): Promise<RuleDto> {
    return Promise.resolve(mockedRuleDto);
  }
}
