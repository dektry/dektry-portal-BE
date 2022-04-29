import { EntityRepository, Repository } from 'typeorm';
import { SkillsToLevelsEntity } from '../entity/skillsToLevels.entity';

@EntityRepository(SkillsToLevelsEntity)
export class skillsToLevelsRepository extends Repository<SkillsToLevelsEntity> {}
