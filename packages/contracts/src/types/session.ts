/**
 * Enum for the status of a session.
 */
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

/**
 * Contract DTO for a session.
 */
export interface SessionDto {
  id: string;
  employeeId: string;
  startedAt: string;
  endedAt: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contract DTO for creating a session.
 */
export interface CreateSessionDto {
  employeeId: string;
}

/**
 * Contract DTO for updating a session.
 */
export interface UpdateSessionDto {
  id: string;
  status: SessionStatus.ENDED;
  endedAt: string;
}
