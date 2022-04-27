import { EntityRepository, Repository } from 'typeorm';
import { SkillEntity } from '../entity/skill.entity';

@EntityRepository(SkillEntity)
export class skillRepository extends Repository<SkillEntity> {}
