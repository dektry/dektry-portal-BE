import { Controller, Get } from '@nestjs/common';
import { PositionGroupService } from '../services/positionGroup.service';
import { PermissionEntity } from '../entity/permission.entity';

@Controller('position-groups')
export class PositionGroupController {
  constructor(private PositionGroupService: PositionGroupService) {}

  @Get()
  getAll(): Promise<PermissionEntity[]> {
    return this.PositionGroupService.getAll();
  }
}
