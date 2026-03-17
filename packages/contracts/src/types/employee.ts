export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  department: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  department?: string;
}
