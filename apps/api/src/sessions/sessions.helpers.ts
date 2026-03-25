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
 * const endedSession = createEndedSession({ id: '123' });
 * // { id: '123', endedAt: new Date(), status: 'ENDED' }
 */
export function createEndedSession(updateSessionDto: {
  id: string;
}): Pick<Session, 'id' | 'endedAt' | 'status'> {
  return {
    id: updateSessionDto.id,
    endedAt: new Date(),
    status: SessionStatus.ENDED,
  };
}

/**
 * Check if a session is ended.
 * @param session - The session to check.
 * @returns True if the session is ended, false otherwise.
 */
export function isEndedSession(session: { status: SessionStatus }): boolean {
  return session.status === SessionStatus.ENDED;
}
