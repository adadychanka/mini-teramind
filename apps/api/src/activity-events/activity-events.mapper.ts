import { ActivityEventDto, ActivityEventType } from '@repo/contracts';
import {
  ActivityEvent as ActivityEventDb,
  ActivityEventType as ActivityEventTypeDb,
  Prisma,
} from 'generated/prisma/client';

export function toActivityEventType(activityEventType: ActivityEventTypeDb): ActivityEventType {
  return ActivityEventType[activityEventType as keyof typeof ActivityEventType];
}

/**
 * Converts a Prisma JSON object to a record. It ignores primitive values and only returns objects.
 * @param metadata - The metadata to convert to a record.
 * @returns The metadata as a record.
 */
function toMetadata(metadata: Prisma.JsonValue): Record<string, unknown> {
  if (typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

export function toActivityEventDto(activityEvent: ActivityEventDb): ActivityEventDto {
  return {
    id: activityEvent.id,
    type: toActivityEventType(activityEvent.type),
    metadata: toMetadata(activityEvent.metadata),
    occurredAt: activityEvent.occurredAt.toISOString(),
    createdAt: activityEvent.createdAt.toISOString(),
    updatedAt: activityEvent.updatedAt.toISOString(),
  };
}
