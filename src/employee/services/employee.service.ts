import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { employeeRepository } from '../repositories/employee.repository';
import { EmployeeEntity } from '../entity/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
  ) {}

  async getEmployeesList(
    limit: number,
    page: number,
    order?: 'ASC' | 'DESC',
    field?: string,
  ): Promise<[EmployeeEntity[], number]> {
    return await this.employeeRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...(order
        ? {
            order: {
              [field]: order,
            },
          }
        : {}),
    });
  }

  async getEmployee(id): Promise<EmployeeEntity> {
    return await this.employeeRepository.findOne(id);
  }
}
