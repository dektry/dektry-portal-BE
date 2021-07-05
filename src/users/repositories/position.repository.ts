import { PositionEntity } from '../entity/position.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PositionEntity)
export class positionRepository extends Repository<PositionEntity> {}
