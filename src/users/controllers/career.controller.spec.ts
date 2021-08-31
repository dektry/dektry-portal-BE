import { Test, TestingModule } from '@nestjs/testing';
import { CareerController } from './career.controller';
import { CareerService } from '../services/career.service';

describe('CareerController', () => {
  let controller: CareerController;

  const mockCareerService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareerController],
      providers: [CareerService],
    })
      .overrideProvider(CareerService)
      .useValue(mockCareerService)
      .compile();

    controller = module.get<CareerController>(CareerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
