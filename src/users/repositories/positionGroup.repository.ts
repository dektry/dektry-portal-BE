import { PositionGroupEntity } from '../entity/positionGroup.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PositionGroupEntity)
export class positionGroupRepository extends Repository<PositionGroupEntity> {}
