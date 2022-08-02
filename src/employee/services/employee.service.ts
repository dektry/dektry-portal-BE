import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { EmployeeEntity } from '../entity/employee.entity';
import { UpdateEmployeeDto } from '../dto/employee.dto';
import { employeeNotFound } from '../utils/constants';
import { updateEmployeePF } from './employee';

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
  ) {}

  async getEmployeesList({
    limit,
    page,
    order,
    field,
    query,
  }: getEmployeesListParams): Promise<[EmployeeEntity[], number]> {
    try {
      return await this.employeeRepository
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
    } catch (error) {
      console.error('[EMPLOYEES_LIST_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEmployee(id): Promise<EmployeeEntity> {
    try {
      return await this.employeeRepository.findOne(id);
    } catch (error) {
      console.error('[GET_EMPLOYEE_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEmployee(
    id: string,
    updatedEmployee: UpdateEmployeeDto,
  ): Promise<UpdateEmployeeDto | UpdateResult> {
    try {
      const updateResult = await this.employeeRepository.update(
        id,
        updatedEmployee,
      );

      if (!updateResult.affected) return updateResult;

      const employee = await this.employeeRepository.findOne(id);
      // temporarily disabled to prevent data corruption in the PF
      // await upd  ateEmployeePF(employee.pfId, employee);

      return employee;
    } catch (error) {
      console.error('[EMPLOYEE_UPDATE_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
