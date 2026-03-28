import { Injectable } from '@nestjs/common';
import { PaginationOutputDto, RuleDto, RuleSeverity } from '@repo/contracts';
import { Prisma } from 'generated/prisma/client';
import { RuleType } from 'generated/prisma/enums';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { FindRulesInputDto } from './dto/find-rules-input.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { toRuleDto } from './rules.mapper';

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
  constructor(private readonly prisma: PrismaService) {}

  async create(createRuleDto: CreateRuleDto): Promise<RuleDto> {
    const rule = await this.prisma.rule.create({
      data: {
        name: createRuleDto.name,
        description: createRuleDto.description,
        type: createRuleDto.type,
        severity: createRuleDto.severity,
        config: createRuleDto.config as Prisma.JsonObject,
        active: createRuleDto.active,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        severity: true,
        config: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return toRuleDto(rule);
  }

  async findAll(findRulesInputDto: FindRulesInputDto): Promise<PaginationOutputDto<RuleDto>> {
    const { page = 1, limit = DEFAULT_PAGINATION_LIMIT } = findRulesInputDto;
    const skip = (page - 1) * limit;

    const where: Prisma.RuleWhereInput = {
      active: findRulesInputDto.active,
    };
    const [rules, total] = await Promise.all([
      this.prisma.rule.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          severity: true,
          config: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.rule.count({
        where,
      }),
    ]);

    const ruleDtos = rules.map(toRuleDto);
    const hasNextPage = page * limit < total;

    return {
      items: ruleDtos,
      total,
      hasNextPage,
    };
  }

  update(ruleId: string, updateRuleDto: UpdateRuleDto): Promise<RuleDto> {
    return Promise.resolve(mockedRuleDto);
  }
}
