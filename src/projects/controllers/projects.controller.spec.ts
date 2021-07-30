import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { projectsRepository } from '../repositories/projects.repository';
import { ProjectsService } from '../services/projects.service';
import { ProjectsController } from './projects.controller';

const newTestProject = {
  name: 'CRoom',
};

const testProject = {
  id: 1,
  name: 'CRoom',
};

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        projectsRepository,
        {
          provide: ProjectsService,
          useValue: {
            createProject: jest.fn(() => testProject),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create new Project', () => {
    describe('if fields are valid', () => {
      it('should return the object with a new Project', async () => {
        const newProject = await controller.createProject(newTestProject);
        expect(newProject).toEqual(testProject);
      });
    });

    describe('if fields are NOT valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newEmptyProject = {
          name: '',
        };

        try {
          await controller.createProject(newEmptyProject);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
