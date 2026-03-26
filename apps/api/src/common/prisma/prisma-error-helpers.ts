import { Prisma } from 'generated/prisma/client';
import { PRISMA_ERROR_CODES, PrismaErrorCode } from './prisma-error-codes';

/**
 * Verify if the error is a prisma known request error.
 * @param error - The error to check
 * @param code - The code to check
 * @returns True if the error is a prisma known request error, false otherwise
 */
export const isPrismaError = (
  error: unknown,
  code: PrismaErrorCode,
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
};

/**
 * Verify if the error is a unique constraint violation error.
 * @param error - The error to check
 * @returns True if the error is a unique constraint violation error, false otherwise
 */
export const isUniqueConstraintViolationError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return isPrismaError(error, PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION);
};

/**
 * Verify if the error is a foreign key constraint violation error.
 * @param error - The error to check
 * @returns True if the error is a foreign key constraint violation error, false otherwise
 */
export const isForeignKeyConstraintViolationError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return isPrismaError(error, PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_VIOLATION);
};

/**
 * Verify if the error is a record not found error.
 * @param error - The error to check
 * @returns True if the error is a record not found error, false otherwise
 */
export const isRecordNotFoundError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return isPrismaError(error, PRISMA_ERROR_CODES.RECORD_NOT_FOUND);
};

/**
 * Try to get the field that caused the error from the meta data of the error.
 * @param meta - The meta data of the error
 * @param field - The field to check
 * @returns The field that caused the error
 */
const tryGetViolatedFieldFromMetaTarget = (
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): string | undefined => {
  if (!error.meta) {
    return undefined;
  }

  const errorTarget = error.meta.target as string[] | undefined;

  return errorTarget?.find((target) => target.includes(field)) ?? undefined;
};

type PrismaPgDriverAdapterError = {
  cause?: {
    originalMessage?: string;
    originalCode?: string;
    kind?: string;
    constraint?: {
      fields?: string[];
    };
  };
};

/**
 * Try to get the field that caused the error from the driver adapter error.
 * @param error - The error to check
 * @param field - The field to check
 * @returns The field that caused the error
 */
const tryGetViolatedFieldFromDriverAdapterError = (
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): string | undefined => {
  if (!error.meta) {
    return undefined;
  }

  const typedMetaWithDriverAdapterError = error.meta as {
    driverAdapterError: PrismaPgDriverAdapterError;
  };

  const violatedFields =
    typedMetaWithDriverAdapterError?.driverAdapterError.cause?.constraint?.fields ?? [];
  const hasFieldInViolatedFields = violatedFields.includes(field);

  return hasFieldInViolatedFields ? field : undefined;
};

/**
 * Verify if the error is prisma known request error and
 * happened due to a field violation.
 * @param error - The error to check
 * @param field - The field that caused the error
 * @returns True if the error is a field error, false otherwise
 */
export const isFieldError = (
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): boolean => {
  if (!error.meta) {
    return false;
  }

  const hasFieldInTarget = Boolean(tryGetViolatedFieldFromMetaTarget(error, field));
  const hasFieldInDriverAdapterError = Boolean(
    tryGetViolatedFieldFromDriverAdapterError(error, field),
  );

  return hasFieldInTarget || hasFieldInDriverAdapterError;
};
