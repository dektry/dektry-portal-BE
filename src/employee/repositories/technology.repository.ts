import { EntityRepository, Repository } from 'typeorm';
import { TechnologyEntity } from '../entity/technology.entity';

@EntityRepository(TechnologyEntity)
export class technologyRepository extends Repository<TechnologyEntity> {}
