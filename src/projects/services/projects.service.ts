import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDto } from '../dto/project.dto';
import { ProjectEntity } from '../entity/project.entity';
import { projectsRepository } from '../repositories/projects.repository';
import * as _ from 'lodash';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(projectsRepository)
    private projectsRepository: projectsRepository,
  ) { }

  async createProject(newProjectProps: ProjectDto): Promise<ProjectEntity> {
    const { name, ...otherProps } = newProjectProps;
    // const isExist = await this.usersRepository.findOne({
    //   email,
    // });
    // if (isExist) {
    //   throw new ConflictException('User with this email is already exist!');
    // } else {
      const newProject = await this.projectsRepository.create({
        ...otherProps,
        name,
      });
      return this.projectsRepository.save(newProject);
    // }
  }
}
