import { EntityRepository, Repository } from 'typeorm';
import { EnglishSkillsToLevelsEntity } from '../entity/englishSkillsToLevels.entity';

@EntityRepository(EnglishSkillsToLevelsEntity)
export class englishSkillsToLevelsRepository extends Repository<EnglishSkillsToLevelsEntity> {}
