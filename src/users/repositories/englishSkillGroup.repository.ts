import { EntityRepository, Repository } from 'typeorm';
import { EnglishSkillGroupEntity } from '../entity/englishSkillGroup.entity';

@EntityRepository(EnglishSkillGroupEntity)
export class englishSkillGroupRepository extends Repository<EnglishSkillGroupEntity> {}
