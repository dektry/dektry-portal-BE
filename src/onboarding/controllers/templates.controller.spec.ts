import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from '../services/templates.service';

describe('TemplatesController', () => {
  let controller: TemplatesController;

  const mockTemplateService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [TemplatesService],
    })
      .overrideProvider(TemplatesService)
      .useValue(mockTemplateService)
      .compile();

    controller = module.get<TemplatesController>(TemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
