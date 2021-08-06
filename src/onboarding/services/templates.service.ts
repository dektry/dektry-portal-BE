import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsEntity } from 'onboarding/entity/groups.entity';
import { TasksEntity } from 'onboarding/entity/tasks.entity';
import { TemplatesEntity } from 'onboarding/entity/templates.entity';
import { groupsRepository } from 'onboarding/repositories/groups.repository';
import { tasksRepository } from 'onboarding/repositories/tasks.repository';
import { templatesRepository } from 'onboarding/repositories/template.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(templatesRepository)
    private templatesRepository: templatesRepository,
    @InjectRepository(groupsRepository)
    private groupsRepository: groupsRepository,
    @InjectRepository(tasksRepository)
    private tasksRepository: tasksRepository,
  ) {}

  sortTasks(templates) {
    const transformedTemplates = templates.map((item) => {
      const sortedTasks = item.tasks.sort((a, b) => a.index - b.index);
      return {
        ...item,
        tasks: sortedTasks,
      };
    });
    return transformedTemplates;
  }

  async getAll(): Promise<TemplatesEntity[]> {
    const allTemplates = await this.templatesRepository.find({
      relations: ['write', 'read', 'group', 'tasks', 'tasks.task', 'target'],
    });
    const sortedTemplates = this.sortTasks(allTemplates);
    return sortedTemplates;
  }

  async getAllTasks(): Promise<TasksEntity[]> {
    const allTasks = await this.tasksRepository.find({
      relations: ['ordered', 'ordered.template'],
    });
    return allTasks;
  }

  async createTemplate(
    templateProps: TemplatesEntity,
  ): Promise<TemplatesEntity> {
    const { name } = templateProps;
    const existTemplate = await this.templatesRepository.findOne({ name });
    if (existTemplate) {
      throw new BadRequestException(`This template is already exist!`);
    }
    if (!name) {
      throw new BadRequestException(`Please, send correct template name!`);
    }
    const newTemplate = await this.templatesRepository.create(templateProps);
    return this.templatesRepository.save(newTemplate);
  }

  async updateTemplate(id: string, newTemplateProps): Promise<TemplatesEntity> {
    try {
      const existTemplate = await this.templatesRepository.findOne({
        where: { id },
      });
      const result = await this.templatesRepository.save({
        ...existTemplate,
        ...newTemplateProps,
      });
      if (!existTemplate) {
        throw new NotFoundException(`Template with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteTemplate(id): Promise<DeleteResult> {
    const result = await this.templatesRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Template with ID '${id}' not found`);
    }
    return result;
  }

  async getAllGroups(): Promise<GroupsEntity[]> {
    const allTemplateGroups = await this.groupsRepository.find({
      relations: [
        'template',
        'template.tasks',
        'template.read',
        'template.write',
        'template.group',
        'template.target',
      ],
    });
    return allTemplateGroups;
  }

  async createGroup(groupProps: GroupsEntity): Promise<GroupsEntity> {
    const newGroup = await this.groupsRepository.create(groupProps);
    const existGroup = await this.groupsRepository.findOne({
      where: { name: groupProps.name },
    });
    if (existGroup) {
      throw new BadRequestException(`This group is already exist!`);
    }
    return this.groupsRepository.save(newGroup);
  }

  async updateGroup(id: string, groupProps): Promise<TemplatesEntity> {
    try {
      const existGroup = await this.groupsRepository.findOne({
        where: { id },
      });
      const result = await this.groupsRepository.save({
        ...existGroup,
        ...groupProps,
      });
      if (!existGroup) {
        throw new NotFoundException(`Template with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteGroup(id): Promise<DeleteResult> {
    const allTemplatesWithGroup = await this.templatesRepository.find({
      where: { group: id },
    });
    const templatesWithoutGroup = allTemplatesWithGroup.map((template) => {
      return { ...template, group: null };
    });
    await this.templatesRepository.save(templatesWithoutGroup);
    const result = await this.groupsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Template group with ID '${id}' not found`);
    }
    return result;
  }
}
