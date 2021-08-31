import * as moment from 'moment';
import { Test, TestingModule } from '@nestjs/testing';
import { projectsHistoryRepository } from '../repositories/projectsHistory.repository';
import { ProjectsHistoryService } from '../services/projectsHistory.service';
import { ProjectsHistoryController } from './projectsHistory.controller';

const dateNow = moment().format();

const testHistory = {
  id: '1id',
  from: '2020-01-23T22:15:51.000Z',
  to: null,
  userId: '',
  projectId: '',
};

const newHistory = {
  id: '1id',
  from: '2020-01-23T22:15:51.000Z',
  to: dateNow,
  userId: '',
  projectId: '',
};

describe('ProjectsHistoryController', () => {
  let controller: ProjectsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsHistoryController],
      providers: [
        projectsHistoryRepository,
        {
          provide: ProjectsHistoryService,
          useValue: {
            updateProjectHistory: jest.fn(() => newHistory),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsHistoryController>(ProjectsHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create update Project History', () => {
    describe('if fields are valid', () => {
      it('should return the object with a new Project', async () => {
        const history = await controller.updateProjectHistory(testHistory.id, testHistory);
        expect(history).toEqual(newHistory);
      });
    });
  });
});
