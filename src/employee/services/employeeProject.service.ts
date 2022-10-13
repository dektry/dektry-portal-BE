import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, getRepository } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { technologyRepository } from '../repositories/technology.repository';
import { employeeProjectRepository } from '../repositories/employeeProject.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { EmployeeProjectDto } from 'employee/dto/employeeProject.dto';

import {
  employeeProjectCantBeSaved,
  employeeNotFound,
  projectNotFound,
  cantDeleteProject,
  projectsNotFound,
} from 'employee/utils/constants';
import { EmployeeProjectEntity } from 'employee/entity/employeeProject.entity';

@Injectable()
export class EmployeeProjectService {
  constructor(
    @InjectRepository(employeeProjectRepository)
    private employeeProjectRepository: employeeProjectRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(technologyRepository)
    private technologyRepository: technologyRepository,
  ) {}

  async createProject(project: EmployeeProjectDto) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        project.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const existingTechnologies = await this.technologyRepository.find();

      const newTechnologies = project.technologies
        .filter((el) => {
          const isExisting = existingTechnologies.some(
            (technology) => technology.name === el.name,
          );

          return !isExisting;
        })
        .map((el) => {
          return this.technologyRepository.create({
            name: el.name,
          });
        });

      await this.technologyRepository.save(newTechnologies);

      const technologiesNames = project.technologies.map((el) => el.name);

      const techInCurrentProject = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });
      delete project.employeeId;
      return await this.employeeProjectRepository.save({
        ...project,
        employee,
        technologies: techInCurrentProject,
      });
    } catch (err) {
      console.error('[CREATE_EMPLOYEE_PROJECT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        employeeProjectCantBeSaved,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editProject(project: EmployeeProjectDto) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        project.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const existingProject = await this.employeeProjectRepository.findOne(
        project.id,
      );
      if (!existingProject)
        throw new HttpException(projectNotFound, HttpStatus.BAD_REQUEST);

      const newTechnologies = project.technologies
        .filter((el) => !el.id)
        .map((el) => {
          return this.technologyRepository.create({
            name: el.name,
          });
        });

      await this.technologyRepository.save(newTechnologies);

      const technologiesNames = project.technologies.map((el) => el.name);

      const techInCurrentProject = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });

      const actualRelationships = await getRepository(EmployeeProjectEntity)
        .createQueryBuilder()
        .relation(EmployeeProjectEntity, 'technologies')
        .of(project)
        .loadMany();

      await getRepository(EmployeeProjectEntity)
        .createQueryBuilder()
        .relation(EmployeeProjectEntity, 'technologies')
        .of(project)
        .addAndRemove(techInCurrentProject, actualRelationships);

      delete project.technologies;
      delete project.employeeId;

      await this.employeeProjectRepository.update(
        { id: project.id },
        {
          ...project,
          employee,
        },
      );

      return await this.employeeProjectRepository.findOne(project.id);
    } catch (err) {
      console.error('[EDIT_EMPLOYEE_PROJECT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        employeeProjectCantBeSaved,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProject(id: string) {
    try {
      return await this.employeeProjectRepository.delete(id);
    } catch (err) {
      console.error('[DELETE_EMPLOYEE_PROJECT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        cantDeleteProject,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProject(id: string) {
    try {
      const project = await this.employeeProjectRepository.findOne({
        where: {
          id: id,
        },
        relations: ['technologies'],
      });
      if (!project)
        throw new HttpException(projectNotFound, HttpStatus.BAD_REQUEST);

      return project;
    } catch (err) {
      console.error('[EDIT_EMPLOYEE_PROJECT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        projectNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProjectsList(employeeId: string) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const projects = await this.employeeProjectRepository.find({
        where: {
          employee,
        },
      });
      console.log(projects);
      
      return projects;
    } catch (err) {
      console.error('[GET_EMPLOYEE_PROJECT_LIST_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        projectsNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
