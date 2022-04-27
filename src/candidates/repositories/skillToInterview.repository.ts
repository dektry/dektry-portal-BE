import { EntityRepository, Repository } from 'typeorm';
import { SkillToInterviewEntity } from '../entity/skillToInterview.entity';

@EntityRepository(SkillToInterviewEntity)
export class skillToInterviewRepository extends Repository<SkillToInterviewEntity> {}
