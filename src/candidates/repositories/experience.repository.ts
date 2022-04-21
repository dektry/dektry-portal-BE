import { EntityRepository, Repository } from 'typeorm';
import { ExperienceEntity } from '../entity/experience.entity';

@EntityRepository(ExperienceEntity)
export class experienceRepository extends Repository<ExperienceEntity> {}
