import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsHistoryService } from './projectsHistory.service';
import { projectsRepository } from '../repositories/projects.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { projectsHistoryRepository } from '../repositories/projectsHistory.repository';

const testProject = {
  id: 1,
  name: 'CRoom',
  managers: [],
  users: [],
};

const newTestProject = {
  name: 'New Test Project',
  managers: [],
  users: [],
};

const newEmptyProject = {
  name: '',
  managers: [],
  users: [],
};

const allProjects = {
  results: [testProject],
  total: 1,
  currentPage: 1,
  next: 2,
  previous: 0,
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testProject),
  createQueryBuilder: jest.fn(),
  findOne: jest.fn().mockResolvedValue(testProject),
  find: jest.fn().mockResolvedValue([testProject]),
  delete: jest.fn().mockResolvedValue({affected: testProject}),
});

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsHistoryService: ProjectsHistoryService;
  let projectRepository: MockRepository;
  let userRepository: MockRepository;
  let projectHistoryRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
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

    service = module.get<ProjectsService>(ProjectsService);
    projectsHistoryService = module.get<ProjectsHistoryService>(ProjectsHistoryService);
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

  describe('create new Project', () => {
    describe('when all fields passed correctly', () => {
      it('should return the object with new Project', async () => {
        projectRepository.create.mockReturnValue(newTestProject);
        projectRepository.save.mockReturnValue(newTestProject);
        projectRepository.findOne.mockReturnValue(undefined);
        const project = await service.createProject(newTestProject);
        expect(project).toEqual(newTestProject);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "ConflictException"', async () => {
        projectRepository.create.mockReturnValue(newEmptyProject);
        projectRepository.save.mockReturnValue(newEmptyProject);
        try {
          await service.createProject(newEmptyProject);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe('get all Projects', () => {
    it('should return Projects with pagination', async () => {
      const projects = await service.getAllProjects();
      expect(JSON.stringify(projects)).toEqual(JSON.stringify(allProjects));
    });
  });

  describe('get Project by name', () => {
    describe('when project with Name exists', () => {
      it('should return the project', async () => {
        const projectName = 'CRoom';

        const project = await service.findProjectByName(projectName, 1, 10);
        expect(project).toEqual(allProjects);
      });
    });
  });

  describe('delete Project by ID', () => {
    describe('when project with ID exists', () => {
      it('should return the project', async () => {
        projectRepository.create.mockReturnValue(testProject);
        projectRepository.save.mockReturnValue(testProject);
        const project = await service.deleteProject(testProject.id);
        expect(project.affected).toEqual(testProject);
      });
    });

    describe('when project with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          projectRepository.delete.mockReturnValue(undefined);
          await service.deleteProject(2);
        } catch(err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
