import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as concat from 'lodash/concat';
import * as size from 'lodash/size';
import * as includes from 'lodash/includes';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { ProjectDto } from '../dto/project.dto';
import { ProjectEntity } from '../entity/project.entity';
import { projectsRepository } from '../repositories/projects.repository';
import { ProjectsHistoryService } from './projectsHistory.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(projectsRepository)
    private projectsRepository: projectsRepository,

    private ProjectsHistoryService: ProjectsHistoryService,
  ) {}

  async createProject(newProjectProps: ProjectDto): Promise<ProjectEntity> {
    const { name, ...otherProps } = newProjectProps;
    const isExist = await this.projectsRepository.findOne({
      name,
    });
    if (!!isExist) {
      throw new ConflictException('Project with this name is already exist!');
    } else {
      const newProject = await this.projectsRepository.create({
        ...otherProps,
        name,
      });
      const createdProject = await this.projectsRepository.save(newProject);
      const projectMemebers = concat(newProject.users, newProject.managers);
      for (let member of projectMemebers) {
        await this.ProjectsHistoryService.createHistory({
          userId: member,
          projectId: createdProject.id,
        });
      }
      return createdProject;
    }
  }

  async getAllProjects(
    page: number = 1,
    limit: number = 10,
    isArchive?: boolean,
  ) {
    const allProjects = await this.projectsRepository.find();
    const projects = await this.projectsRepository.find({
      where: isArchive ? { isArchive } : {},
      take: limit,
      skip: limit * (page - 1),
      order: {
        name: 'ASC',
      },
    });
    return {
      results: projects,
      total: size(allProjects),
      currentPage: page,
      next: page + 1,
      previous: page - 1,
    };
  }

  async findProjectByName(name: string, page: number = 1, limit: number = 10) {
    const allProjects = await this.projectsRepository.find({
      where: `LOWER(name) LIKE LOWER('%${name}%')`,
    });
    const projects = await this.projectsRepository.find({
      where: `LOWER(name) LIKE LOWER('%${name}%')`,
      order: {
        name: 'ASC',
      },
      take: limit,
      skip: limit * (page - 1),
    });
    return {
      results: projects,
      total: size(allProjects),
      currentPage: page,
      next: page + 1,
      previous: page - 1,
    };
  }

  async updateProject(
    id: string,
    newProjectProps: ProjectDto,
  ): Promise<ProjectEntity> {
    const updatedProject = await this.projectsRepository.findOne({ id });
    const updatedProjectMembers = concat(
      updatedProject.managers,
      updatedProject.users,
    );
    const newProjectMembers = concat(
      newProjectProps.managers,
      newProjectProps.users,
    );
    const allMembers = concat(updatedProjectMembers, newProjectMembers);
    try {
      const result = await this.projectsRepository.save({
        ...newProjectProps,
      });
      for (let member of allMembers) {
        if (
          includes(updatedProjectMembers, member) &&
          !includes(newProjectMembers, member)
        ) {
          await this.ProjectsHistoryService.updateHistoryTo({
            userId: member,
            projectId: id,
          });
        }
        if (
          includes(newProjectMembers, member) &&
          !includes(updatedProjectMembers, member)
        ) {
          await this.ProjectsHistoryService.createHistory({
            userId: member,
            projectId: id,
          });
        }
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteProject(id): Promise<DeleteResult> {
    try {
      const result = await this.projectsRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Project with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async archiveProject(id): Promise<ProjectEntity> {
    const updatedProject = await this.projectsRepository.findOne({ id });
    const newProjectProps = {
      ...updatedProject,
      isArchive: true,
    };
    const allMembers = concat(updatedProject.managers, updatedProject.users);
    try {
      const result = await this.projectsRepository.save({
        ...newProjectProps,
      });
      for (let member of allMembers) {
        await this.ProjectsHistoryService.updateHistoryTo({
          userId: member,
          projectId: id,
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
