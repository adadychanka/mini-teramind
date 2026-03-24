-- Manual migration to add a partial unique index on the employeeId column for the Session entity.
-- This is to ensure that only one active session can exist for a given employee at a given time.
CREATE UNIQUE INDEX Session_employeeId_active_partial_key ON "Session"("employeeId") WHERE "status" = 'ACTIVE';