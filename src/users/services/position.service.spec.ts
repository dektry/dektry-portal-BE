import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionService } from './position.service';
import { positionRepository } from '../repositories/position.repository';
import { careerRepository } from '../repositories/career.repository';

describe('PositionService', () => {
  let service: PositionService;

  const mockPositionRepository = {};
  const mockCareerRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
        {
          provide: getRepositoryToken(positionRepository),
          useValue: mockPositionRepository,
        },
        {
          provide: getRepositoryToken(careerRepository),
          useValue: mockCareerRepository,
        },
      ],
    }).compile();

    service = module.get<PositionService>(PositionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
