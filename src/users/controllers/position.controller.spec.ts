import { Test, TestingModule } from '@nestjs/testing';
import { PositionService } from 'users/services/position.service';
import { PositionController } from './position.controller';

describe('PositionController', () => {
  let controller: PositionController;

  const mockPositionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [PositionService],
    })
      .overrideProvider(PositionService)
      .useValue(mockPositionService)
      .compile();

    controller = module.get<PositionController>(PositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
