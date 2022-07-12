import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillToSoftInterviewEntity } from '../entity/softSkillToSoftInterview.entity';

@EntityRepository(SoftSkillToSoftInterviewEntity)
export class softSkillToSoftInterviewRepository extends Repository<SoftSkillToSoftInterviewEntity> {}
