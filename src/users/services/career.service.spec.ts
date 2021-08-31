import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerService } from './career.service';
import { positionRepository } from '../repositories/position.repository';
import { usersRepository } from '../repositories/users.repository';
import { careerRepository } from '../repositories/career.repository';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('CareerService', () => {
  let service: CareerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CareerService,
        {
          provide: getRepositoryToken(positionRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(usersRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(careerRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CareerService>(CareerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
