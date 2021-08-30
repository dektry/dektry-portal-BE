import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CareerService } from './career.service';
import { careerRepository } from '../repositories/career.repository';
import { usersRepository } from '../repositories/users.repository';
import { positionRepository } from '../repositories/position.repository';

describe('CareerService', () => {
  let service: CareerService;

  const mockCareerService = {};
  const mockUserService = {};
  const mockPositionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareerService,
        {
          provide: getRepositoryToken(careerRepository),
          useValue: mockCareerService,
        },
        {
          provide: getRepositoryToken(usersRepository),
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(positionRepository),
          useValue: mockPositionService,
        },
      ],
    }).compile();

    service = module.get<CareerService>(CareerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
