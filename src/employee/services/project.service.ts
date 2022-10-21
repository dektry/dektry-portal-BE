import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, getRepository } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { technologyRepository } from '../repositories/technology.repository';
import { projectRepository } from '../repositories/project.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { ProjectDto } from '../dto/project.dto';

import {
  projectCantBeSaved,
  employeeNotFound,
  projectNotFound,
  cantDeleteProject,
  projectsNotFound,
} from '../utils/constants';
import { ProjectEntity } from '../entity/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(projectRepository)
    private projectRepository: projectRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(technologyRepository)
    private technologyRepository: technologyRepository,
  ) {}

  async createProject(project: ProjectDto) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        project.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const technologiesNames = project.technologies?.map((el) =>
        el.name?.toLowerCase(),
      );

      const existingTechnologies = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });

      const newTechnologies = [];
      const hash = {};

      for (const exists of existingTechnologies) {
        hash[exists.name] = exists.id;
      }

      for (const technology of project.technologies) {
        if (!hash[technology.name?.toLowerCase()]) {
          newTechnologies.push(
            this.technologyRepository.create({
              name: technology.name?.toLowerCase(),
            }),
          );
        }
      }

      await this.technologyRepository.save(newTechnologies);

      const techInCurrentProject = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });

      const projectToSave = {
        name: project.name,
        duration: project.duration,
        role: project.role,
        team_size: project.team_size,
        description: project.description,
        responsibilities: project.responsibilities,
        employee,
        technologies: techInCurrentProject,
      };

      return await this.projectRepository.save(projectToSave);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : projectCantBeSaved,
        err?.status,
      );
    }
  }

  async editProject(project: ProjectDto) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        project.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const existingProject = await this.projectRepository.findOne(project.id);
      if (!existingProject)
        throw new HttpException(projectNotFound, HttpStatus.BAD_REQUEST);

      const technologiesNames = project.technologies.map((el) =>
        el.name?.toLowerCase(),
      );

      const existingTechnologies = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });

      const newTechnologies = [];
      const hash = {};

      for (const exists of existingTechnologies) {
        hash[exists.name] = exists.id;
      }

      for (const technology of project.technologies) {
        if (!hash[technology.name?.toLowerCase()]) {
          newTechnologies.push(
            this.technologyRepository.create({
              name: technology.name?.toLowerCase(),
            }),
          );
        }
      }

      await this.technologyRepository.save(newTechnologies);

      const techInCurrentProject = await this.technologyRepository.find({
        where: {
          name: In(technologiesNames),
        },
      });

      const actualRelationships = await getRepository(ProjectEntity)
        .createQueryBuilder()
        .relation(ProjectEntity, 'technologies')
        .of(project)
        .loadMany();

      await getRepository(ProjectEntity)
        .createQueryBuilder()
        .relation(ProjectEntity, 'technologies')
        .of(project)
        .addAndRemove(techInCurrentProject, actualRelationships);

      const projectToUpdate = {
        name: project.name,
        duration: project.duration,
        role: project.role,
        team_size: project.team_size,
        description: project.description,
        responsibilities: project.responsibilities,
        employee,
      };

      await this.projectRepository.update({ id: project.id }, projectToUpdate);

      return await this.projectRepository.findOne(project.id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : projectCantBeSaved,
        err?.status,
      );
    }
  }

  async deleteProject(id: string) {
    try {
      return await this.projectRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : cantDeleteProject,
        err?.status,
      );
    }
  }

  async getProject(id: string) {
    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: id,
        },
        relations: ['technologies', 'employee'],
      });
      if (!project)
        throw new HttpException(projectNotFound, HttpStatus.BAD_REQUEST);

      return project;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : projectNotFound,
        err?.status,
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

      const projects = await this.projectRepository.find({
        where: {
          employee,
        },
        relations: ['technologies', 'employee'],
      });

      return projects;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : projectsNotFound,
        err?.status,
      );
    }
  }
}