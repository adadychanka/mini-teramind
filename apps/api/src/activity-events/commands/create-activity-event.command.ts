import { Command } from '@nestjs/cqrs';
import { ActivityEventDto } from '@repo/contracts';
import { ActivityEventType } from 'generated/prisma/enums';

export class CreateActivityEventCommand extends Command<ActivityEventDto> {
  constructor(
    public readonly payload: {
      sessionId: string;
      type: ActivityEventType;
      occurredAt: string;
      metadata: Record<string, unknown>;
    },
  ) {
    super();
  }
}
