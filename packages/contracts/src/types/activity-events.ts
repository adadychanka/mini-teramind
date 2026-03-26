/**
 * Enum for the type of activity event.
 */
export enum ActivityEventType {
  APP = 'APP',
  WEB = 'WEB',
  FILE = 'FILE',
  KEYSTROKE_SUMMARY = 'KEYSTROKE_SUMMARY',
}

/**
 * Contract DTO for an activity event.
 */
export interface ActivityEventDto {
  id: string;
  type: ActivityEventType;
  metadata: Record<string, unknown>;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contract DTO for creating an activity event.
 */
export interface CreateActivityEventDto {
  type: ActivityEventType;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

/**
 * Contract DTO for updating an activity event.
 */
export interface UpdateActivityEventDto {
  id: string;
  type: ActivityEventType;
  metadata: Record<string, unknown>;
  occurredAt: string;
}
