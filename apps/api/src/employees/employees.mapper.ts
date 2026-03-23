import { type EmployeeDto } from '@repo/contracts';
import { type Employee } from 'generated/prisma/client';

export function toEmployeeDto(employee: Employee): EmployeeDto {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department ?? null,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
