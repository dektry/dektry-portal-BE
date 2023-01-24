import { EntityRepository, Repository } from 'typeorm';
import { EnglishSkillEntity } from '../entity/englishSkill.entity';

@EntityRepository(EnglishSkillEntity)
export class englishSkillRepository extends Repository<EnglishSkillEntity> {}
