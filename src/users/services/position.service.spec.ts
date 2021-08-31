import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionService } from './position.service';
import { positionRepository } from '../repositories/position.repository';
import { careerRepository } from '../repositories/career.repository';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('PositionService', () => {
  let service: PositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
        {
          provide: getRepositoryToken(positionRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(careerRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
