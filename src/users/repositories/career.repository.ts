import { CareerEntity } from '../entity/career.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CareerEntity)
export class careerRepository extends Repository<CareerEntity> {}
