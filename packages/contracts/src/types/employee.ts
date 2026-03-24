/**
 * Contract DTO for an employee.
 */
export interface EmployeeDto {
  id: string;
  name: string;
  email: string;
  department?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contract DTO for creating an employee.
 */
export interface CreateEmployeeDto {
  name: string;
  email: string;
  department?: string;
}

/**
 * Contract DTO for updating an employee.
 */
export interface UpdateEmployeeDto {
  id: string;
  name?: string;
  email?: string;
  department?: string;
}
