import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivityEventDto } from '@repo/contracts';
import { Prisma } from 'generated/prisma/client';
import { isForeignKeyConstraintViolationError } from 'src/common/prisma/prisma-error-helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { toActivityEventDto } from '../activity-events.mapper';
import { CreateActivityEventCommand } from './create-activity-event.command';

@CommandHandler(CreateActivityEventCommand)
export class CreateActivityEventHandler implements ICommandHandler<CreateActivityEventCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateActivityEventCommand): Promise<ActivityEventDto> {
    const {
      payload: { sessionId, type, occurredAt, metadata },
    } = command;

    const existingSession = await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
      },
    });
    if (!existingSession) {
      throw new NotFoundException('Session not found');
    }

    try {
      const activityEvent = await this.prisma.activityEvent.create({
        data: {
          type,
          metadata: metadata as Prisma.JsonObject,
          occurredAt,
          sessionId,
        },
        select: {
          id: true,
          type: true,
          metadata: true,
          sessionId: true,
          occurredAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return toActivityEventDto(activityEvent);
    } catch (error) {
      if (isForeignKeyConstraintViolationError(error)) {
        throw new NotFoundException('Session not found');
      }
      throw error;
    }
  }
}
