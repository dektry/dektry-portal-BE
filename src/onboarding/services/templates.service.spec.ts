import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { templatesRepository } from '../repositories/template.repository';
import { groupsRepository } from '../repositories/groups.repository';
import { tasksRepository } from '../repositories/tasks.repository';
import { orderedTasksRepository } from '../repositories/orderedTasks.repository';
import { accessRepository } from '../../users/repositories/access.repository';

describe('TemplatesService', () => {
  let service: TemplatesService;

  const mockTemplatesRepository = {};
  const mockGroupsRepository = {};
  const mockTasksRepository = {};
  const mockOrderedTasksRepository = {};
  const mockAccessRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getRepositoryToken(templatesRepository),
          useValue: mockTemplatesRepository,
        },
        {
          provide: getRepositoryToken(groupsRepository),
          useValue: mockGroupsRepository,
        },
        {
          provide: getRepositoryToken(tasksRepository),
          useValue: mockTasksRepository,
        },
        {
          provide: getRepositoryToken(orderedTasksRepository),
          useValue: mockOrderedTasksRepository,
        },
        {
          provide: getRepositoryToken(accessRepository),
          useValue: mockAccessRepository,
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
