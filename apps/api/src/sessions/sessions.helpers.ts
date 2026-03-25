import { Session, SessionStatus } from 'generated/prisma/browser';

/**
 * Create a new active session.
 * Active sessions are created when an employee starts a session.
 *
 * @param createSessionDto - The create session dto.
 * @returns The active session data for the database.
 *
 * @example
 * const activeSession = createActiveSession({ employeeId: '123' });
 * // { employeeId: '123', startedAt: new Date(), endedAt: null, status: 'ACTIVE' }
 */
export function createActiveSession(createSessionDto: {
  employeeId: string;
}): Pick<Session, 'employeeId' | 'startedAt' | 'endedAt' | 'status'> {
  return {
    employeeId: createSessionDto.employeeId,
    startedAt: new Date(),
    endedAt: null,
    status: SessionStatus.ACTIVE,
  };
}

/**
 * Create a new ended session.
 * Ended sessions are created when an employee ends a session.
 *
 * @param updateSessionDto - The update session dto.
 * @returns The ended session data for the database.
 *
 * @example
 * const endedSession = createEndedSession({ id: '123', employeeId: '123' });
 * // { id: '123', endedAt: new Date(), status: 'ENDED', employeeId: '123' }
 */
export function createEndedSession(updateSessionDto: {
  id: string;
  employeeId: string;
}): Pick<Session, 'id' | 'endedAt' | 'status' | 'employeeId'> {
  return {
    id: updateSessionDto.id,
    endedAt: new Date(),
    status: SessionStatus.ENDED,
    employeeId: updateSessionDto.employeeId,
  };
}
