import { Test, TestingModule } from '@nestjs/testing';
import { PositionController } from './position.controller';
import { PositionService } from '../services/position.service';

describe('PositionController', () => {
  let controller: PositionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [
        {
          provide: PositionService,
          useValue: { },
        },
      ]
    }).compile();

    controller = module.get<PositionController>(PositionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
