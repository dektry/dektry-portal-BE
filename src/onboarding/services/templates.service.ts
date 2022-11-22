import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'enums/permissions.enum';
import { GroupsEntity } from 'onboarding/entity/groups.entity';
import { TasksEntity } from 'onboarding/entity/tasks.entity';
import { TemplatesEntity } from 'onboarding/entity/templates.entity';
import { groupsRepository } from 'onboarding/repositories/groups.repository';
import { orderedTasksRepository } from 'onboarding/repositories/orderedTasks.repository';
import { tasksRepository } from 'onboarding/repositories/tasks.repository';
import { templatesRepository } from 'onboarding/repositories/template.repository';
import { DeleteResult } from 'typeorm';
import { accessRepository } from 'users/repositories/access.repository';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(templatesRepository)
    private templatesRepository: templatesRepository,
    @InjectRepository(groupsRepository)
    private groupsRepository: groupsRepository,
    @InjectRepository(tasksRepository)
    private tasksRepository: tasksRepository,
    @InjectRepository(orderedTasksRepository)
    private orderedTasksRepository: orderedTasksRepository,
    @InjectRepository(accessRepository)
    private accessRepository: accessRepository,
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

  async getAll(request): Promise<TemplatesEntity[]> {
    let allTemplates = await this.templatesRepository.find({
      relations: ['write', 'read', 'group', 'tasks', 'tasks.task', 'target'],
    });
    const access = await this.accessRepository.findOne(
      { name: 'onboarding-templates' },
      {
        relations: ['positions', 'positionsGroups'],
      },
    );
    const currentPositions = request.user.career
      .filter((item) => item.to === null)
      .map((item) => item.position.id);
    if (
      !request.user.role.permissions
        .map((item) => item.name)
        .includes(Permissions.workWithOnBoardingTemplates) &&
      !access.positions.some((position) =>
        currentPositions.includes(position.id),
      )
    ) {
      allTemplates = allTemplates.filter((item) => {
        return (
          item.write.some((position) =>
            currentPositions.includes(position.id),
          ) ||
          item.read.some((position) => currentPositions.includes(position.id))
        );
      });
    }

    const sortedTemplates = this.sortTasks(allTemplates).sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return sortedTemplates;
  }

  async getAllTasks(): Promise<TasksEntity[]> {
    const allTasks = await this.tasksRepository.find({
      relations: ['ordered', 'ordered.template', 'ordered.template.target'],
    });
    const sortedTasks = allTasks.sort((a, b) => {
      const nameA = a.title.toUpperCase();
      const nameB = b.title.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return sortedTasks;
  }

  async createTask(CreateTaskDto: TasksEntity): Promise<TasksEntity> {
    const { title } = CreateTaskDto;
    const existTask = await this.tasksRepository.findOne({ title });
    if (existTask) {
      throw new BadRequestException(`Task with this name is already exist!`);
    }
    if (!title) {
      throw new BadRequestException(`Please, send correct task name!`);
    }
    const newTask = await this.tasksRepository.create(CreateTaskDto);
    return this.tasksRepository.save(newTask);
  }

  async updateTask(id: string, taskProps): Promise<TasksEntity> {
    try {
      const existTask = await this.tasksRepository.findOne({
        where: { id },
      });
      const result = await this.tasksRepository.save({
        ...existTask,
        ...taskProps,
      });
      if (!existTask) {
        throw new NotFoundException(`Task with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteTask(id): Promise<DeleteResult> {
    const allOrdered = await this.orderedTasksRepository.find({
      task: {
        id,
      },
    });
    if (allOrdered.length) {
      const allOrderedId = allOrdered.map((item) => item.id);
      await this.orderedTasksRepository.delete(allOrderedId);
    }
    const resultOfElement = await this.tasksRepository.delete(id);
    if (!resultOfElement.affected) {
      throw new NotFoundException(`Task with ID '${id}' not found`);
    }
    return resultOfElement;
  }

  async createTemplate(
    templateProps: TemplatesEntity,
  ): Promise<TemplatesEntity> {
    const { name } = templateProps;
    const existTemplate = await this.templatesRepository.findOne({ name });
    if (existTemplate) {
      throw new BadRequestException(
        `Template with this name is already exist!`,
      );
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
    const allOrdered = await this.orderedTasksRepository.find({
      template: {
        id,
      },
    });
    if (allOrdered.length) {
      const allOrderedId = allOrdered.map((item) => item.id);
      await this.orderedTasksRepository.delete(allOrderedId);
    }
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
