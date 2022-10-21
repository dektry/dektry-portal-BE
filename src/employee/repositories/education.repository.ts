import { Repository, EntityRepository } from 'typeorm';
import { EducationEntity } from '../entity/education.entity';

@EntityRepository(EducationEntity)
export class educationRepository extends Repository<EducationEntity> {}
