import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillEntity } from '../entity/softSkill.entity';

@EntityRepository(SoftSkillEntity)
export class softSkillRepository extends Repository<SoftSkillEntity> {}
