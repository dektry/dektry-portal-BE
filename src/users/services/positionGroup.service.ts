import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionGroupEntity } from '../entity/positionGroup.entity';
import { positionGroupRepository } from '../repositories/positionGroup.repository';

@Injectable()
export class PositionGroupService {
  constructor(
    @InjectRepository(positionGroupRepository)
    private positionGroupRepository: positionGroupRepository,
  ) {}

  async getAll(): Promise<PositionGroupEntity[]> {
    const allPositionGroups = await this.positionGroupRepository.find();
    return allPositionGroups;
  }
}
