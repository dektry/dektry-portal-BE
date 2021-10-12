import { EntityRepository, Repository } from 'typeorm';
import { VacationsEntity } from '../entity/vacations.entity';

@EntityRepository(VacationsEntity)
export class vacationRepository extends Repository<VacationsEntity> {}
