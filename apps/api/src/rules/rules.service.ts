import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOutputDto, RuleDto } from '@repo/contracts';
import { Prisma } from 'generated/prisma/client';
import { DEFAULT_PAGINATION_LIMIT } from 'src/common/pagination/limits';
import { isRecordNotFoundError } from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { FindRulesInputDto } from './dto/find-rules-input.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { toRuleDto } from './rules.mapper';
import { validateRuleConfig } from './validation/rules-config-validation/validate-rule-config';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRuleDto: CreateRuleDto): Promise<RuleDto> {
    const validationResult = validateRuleConfig(createRuleDto.type, createRuleDto.config);
    if (!validationResult.isValid) {
      throw new BadRequestException({
        message: 'Invalid rule configuration',
        errors: validationResult.errors,
      });
    }

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

  async update(ruleId: string, updateRuleDto: UpdateRuleDto): Promise<RuleDto> {
    // If the config is being updated, validate it
    if (updateRuleDto.config) {
      const existingRule = await this.prisma.rule.findUnique({
        where: { id: ruleId },
        select: {
          id: true,
          type: true,
        },
      });
      if (!existingRule) {
        throw new NotFoundException(`Rule ${ruleId} not found`);
      }

      const validationResult = validateRuleConfig(existingRule.type, updateRuleDto.config);
      if (!validationResult.isValid) {
        throw new BadRequestException({
          message: 'Invalid rule configuration',
          errors: validationResult.errors,
        });
      }
    }

    try {
      const rule = await this.prisma.rule.update({
        where: { id: ruleId },
        data: {
          name: updateRuleDto.name,
          description: updateRuleDto.description,
          severity: updateRuleDto.severity,
          config: updateRuleDto.config as Prisma.JsonObject,
          active: updateRuleDto.active,
        },
      });

      return toRuleDto(rule);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new NotFoundException(`Rule ${ruleId} not found`);
      }

      throw error;
    }
  }
}
