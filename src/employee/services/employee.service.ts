import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';

import { ProjectService } from './project.service';
import { EducationService } from './education.service';
import { LanguageService } from './language.service';

import { EmployeeEntity } from '../entity/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee.dto';
import { employeeNotFound, employeeCantBeSaved } from '../utils/constants';
import { formatUpdatedEmployee } from '../utils/formatUpdatedEmployee';

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
    @Inject(EducationService)
    private readonly educationService: EducationService,
    @Inject(ProjectService)
    private readonly projectsService: ProjectService,
    @Inject(LanguageService)
    private readonly languageService: LanguageService,
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
  ): Promise<EmployeeEntity | UpdateResult> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        id,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const updateInfo = formatUpdatedEmployee(updatedEmployee);

      const updateResult = await this.employeeRepository.update(id, updateInfo);

      if (!updateResult.affected) return updateResult;

      const resultEmployee = await this.employeeRepository.findOne(id);
      // temporarily disabled to prevent data corruption in the PF
      // await upd  ateEmployeePF(employee.pfId, employee);

      return resultEmployee;
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

  async deleteEmployee(id: string) {
    try {
      await this.employeeRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : employeeNotFound,
        err?.status,
      );
    }
  }

  async createEmployee(employee: CreateEmployeeDto) {
    try {
      const employeeInfo = formatUpdatedEmployee(employee);

      const createdEmployee = await this.employeeRepository
        .create(employeeInfo)
        .save();

      for (const project of employee.projects) {
        const projectToSave = {
          ...project,
          employeeId: createdEmployee.id,
        };
        await this.projectsService.createProject(projectToSave);
      }

      for (const education of employee.educations) {
        const educationToSave = {
          ...education,
          employeeId: createdEmployee.id,
        };
        await this.educationService.createEducation(educationToSave);
      }

      for (const language of employee.languages) {
        const languageToSave = {
          ...language,
          employeeId: createdEmployee.id,
        };

        await this.languageService.createLanguage(languageToSave);
      }
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : employeeCantBeSaved,
        err?.status,
      );
    }
  }
}
