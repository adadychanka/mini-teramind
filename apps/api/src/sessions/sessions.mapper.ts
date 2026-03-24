import { SessionStatus, type SessionDto } from '@repo/contracts';
import { SessionStatus as SessionStatusDb, type Session } from 'generated/prisma/client';

export function toSessionStatus(status: SessionStatusDb): SessionStatus {
  return SessionStatus[status as keyof typeof SessionStatus];
}

export function toSessionDto(session: Session): SessionDto {
  return {
    id: session.id,
    employeeId: session.employeeId,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString() ?? null,
    status: toSessionStatus(session.status),
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}
