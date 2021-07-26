import { Controller, Get } from '@nestjs/common';
import { PositionGroupService } from '../services/positionGroup.service';
import { PositionGroupEntity } from '../entity/positionGroup.entity';

@Controller('position-groups')
export class PositionGroupController {
  constructor(private PositionGroupService: PositionGroupService) {}

  @Get()
  getAll(): Promise<PositionGroupEntity[]> {
    return this.PositionGroupService.getAll();
  }
}
