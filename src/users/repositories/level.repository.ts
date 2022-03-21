import { CareerLevelEntity } from '../entity/careerLevel.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CareerLevelEntity)
export class levelRepository extends Repository<CareerLevelEntity> {}
