import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { projectsRepository } from '../repositories/projects.repository';

const testProject = {
  id: 1,
  name: 'CRoom',
};

const newTestProject = {
  name: 'CRoom',
};

const newEmptyProject = {
  name: '',
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testProject),
  createQueryBuilder: jest.fn(),
});

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(projectsRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(projectsRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<MockRepository>(
      getRepositoryToken(projectsRepository),
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
        const project = await service.createProject(newTestProject);
        expect(project).toEqual(newTestProject);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "BadRequestException"', async () => {
        projectRepository.create.mockReturnValue(newEmptyProject);
        projectRepository.save.mockReturnValue(newEmptyProject);
        try {
          await service.createProject(newEmptyProject);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });

  // describe('get all Projects', () => {
  //   it('should return the array of Projects', async () => {
  //     let createQueryBuilder: any = {
  //       leftJoinAndSelect: () => createQueryBuilder,
  //     };

  //     createQueryBuilder = {
  //       ...createQueryBuilder,
  //       leftJoinAndSelectе: () => createQueryBuilder,
  //       select: () => createQueryBuilder,
  //       getRawMany: () => [],
  //     };

  //     jest
  //       .spyOn(projectRepository, 'createQueryBuilder')
  //       .mockImplementation(() => createQueryBuilder);

  //     const projects = await service.getAllProjects();
  //     expect(projects).resolves.toEqual([]);
  //   });
  // });
});
