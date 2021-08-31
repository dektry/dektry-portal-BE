import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import * as moment from 'moment';
import { ProjectsHistoryService } from './projectsHistory.service';
import { projectsRepository } from '../repositories/projects.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { projectsHistoryRepository } from '../repositories/projectsHistory.repository';

const testHistory = {
  id: 1,
  from: '2020-01-23T22:15:51.000Z',
  to: null,
  userId: '',
  projectId: '',
};

const newHistory = {
  from: '2020-01-23T22:15:51.000Z',
  to: null,
  userId: '',
  projectId: '',
};

const newEmptyHistory = {
  from: '',
  to: null,
  userId: '',
  projectId: '',
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testHistory),
  createQueryBuilder: jest.fn(),
  findOne: jest.fn().mockResolvedValue(testHistory),
  find: jest.fn().mockResolvedValue([testHistory]),
});

describe('ProjectsHistoryService', () => {
  let service: ProjectsHistoryService;
  let projectRepository: MockRepository;
  let userRepository: MockRepository;
  let projectHistoryRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsHistoryService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(projectsRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(usersRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(projectsHistoryRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProjectsHistoryService>(ProjectsHistoryService);
    projectRepository = module.get<MockRepository>(
      getRepositoryToken(projectsRepository),
    );
    userRepository = module.get<MockRepository>(
      getRepositoryToken(usersRepository),
    );
    projectHistoryRepository = module.get<MockRepository>(
      getRepositoryToken(projectsHistoryRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create new Project History', () => {
    describe('when all fields passed correctly', () => {
      it('should return the object with new Project History', async () => {
        projectHistoryRepository.create.mockReturnValue(newHistory);
        projectHistoryRepository.save.mockReturnValue(newHistory);
        const history = await service.createHistory(newHistory);
        expect(history).toEqual(newHistory);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "ConflictException"', async () => {
        projectRepository.create.mockReturnValue(newEmptyHistory);
        projectRepository.save.mockReturnValue(newEmptyHistory);
        try {
          await service.createHistory(newEmptyHistory);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe('update Project History fields', () => {
    it('should return History with updated fields', async () => {
      const updatedHistory = {...testHistory, to: '2020-10-23T22:15:51.000Z'};
      projectHistoryRepository.save.mockReturnValue(updatedHistory);
      const history = await service.updateProjectHistory(updatedHistory);
      expect(history).toEqual(updatedHistory);
    });
  });

  describe('update Project History field "to" to current date', () => {
    it('should return History with updated field "to" to current date', async () => {
      const dateNow = moment().format();
      const updatedHistory = {...testHistory, to: dateNow};
      projectHistoryRepository.save.mockReturnValue(updatedHistory);
      const history = await service.updateHistoryTo(updatedHistory);
      expect(history).toEqual(updatedHistory);
    });
  });
});
