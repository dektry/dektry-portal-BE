import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DeleteResult } from 'typeorm';
import { ProjectHistoryDto } from '../dto/projectHistory.dto';
import { ProjectHistoryEntity } from '../entity/projectHistory.entity';
import { projectsHistoryRepository } from '../repositories/projectsHistory.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { projectsRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectsHistoryService {
  constructor(
    @InjectRepository(projectsHistoryRepository)
    private projectsHistoryRepository: projectsHistoryRepository,
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(projectsRepository)
    private projectsRepository: projectsRepository,
  ) { }

  async createHistory (newProjectHistoryProps: ProjectHistoryDto): Promise<ProjectHistoryEntity> {
    const { userId, projectId } = newProjectHistoryProps;
    const user = await this.usersRepository.findOne({ id: userId });
    const project = await this.projectsRepository.findOne({ id: projectId });
    const dateNow = moment().format();
    const history = {
      from: dateNow,
      to: null,
      userId: user,
      projectId: project,
    };
    const newHistory = await this.projectsHistoryRepository.create(history);
    return this.projectsHistoryRepository.save(newHistory);
  }

  async updateHistoryTo(newProjectHistoryProps: ProjectHistoryDto): Promise<ProjectHistoryEntity> {
    const { userId, projectId } = newProjectHistoryProps;
    const user = await this.usersRepository.findOne({ id: userId });
    const project = await this.projectsRepository.findOne({ id: projectId });
    const history = await this.projectsHistoryRepository.findOne({ userId: user, projectId: project });
    const dateNow = moment().format();
    try {
      const result = await this.projectsHistoryRepository.save({
        ...history,
        to: dateNow,
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async updateProjectHistory(history: any): Promise<ProjectHistoryEntity> {
    try {
      const project = await this.projectsRepository.findOne({ id: history.projectId.id });
      if (!history.to && project.isArchive) {
        throw new ConflictException('The project is archived. You cannot change its date "to" to now!');
      }
      const dateNow = moment().format();
      if (moment(history.to).isAfter(dateNow) || moment(history.from).isAfter(dateNow)) {
        throw new ConflictException('Project date cannot be later than the current date!');
      }
      const result = await this.projectsHistoryRepository.save({
        ...history
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}
