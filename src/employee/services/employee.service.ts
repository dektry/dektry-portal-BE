import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { EmployeeEntity } from '../entity/employee.entity';
import { UpdateEmployeeDto } from '../dto/employee.dto';

type getEmployeesListParams = {
  limit: number;
  page: number;
  order?: 'ASC' | 'DESC';
  field?: string;
  query?: string;
};

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
  ) { }

  async getEmployeesList({
    limit,
    page,
    order,
    field,
    query,
  }: getEmployeesListParams): Promise<[EmployeeEntity[], number]> {
    return this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.fullName ILIKE :query', {
        query: `%${query ? query.trim() : ''}%`,
      })
      .skip(limit * (page - 1))
      .take(limit)
      .orderBy(
        order
          ? {
            [`employee.${field}`]: order,
          }
          : {},
      )
      .getManyAndCount();
  }

  async getEmployee(id): Promise<EmployeeEntity> {
    return await this.employeeRepository.findOne(id);
  }

  async updateEmployee(
    id: string,
    updatedEmployee: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeDto | UpdateResult> {
    console.log('EMPLOYEE', updatedEmployee);
    const updateResult = await this.employeeRepository.update(
      id,
      updatedEmployee,
    );

    if (!updateResult.affected) return updateResult;

    const employee = await this.employeeRepository.findOne(id);

    return employee;
  }
}
