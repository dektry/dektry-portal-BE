import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../entity/permission.entity';
import { positionGroupRepository } from '../repositories/positionGroup.repository';

@Injectable()
export class PositionGroupService {
  constructor(
    @InjectRepository(positionGroupRepository)
    private positionGroupRepository: positionGroupRepository,
  ) {}

  async getAll(): Promise<PermissionEntity[]> {
    const allPositionGroups = await this.positionGroupRepository.find();
    return allPositionGroups;
  }
}
