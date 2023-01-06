import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillsToLevelsEntity } from '../entity/softSkillsToLevels.entity';

@EntityRepository(SoftSkillsToLevelsEntity)
export class softSkillsToLevelsRepository extends Repository<SoftSkillsToLevelsEntity> {}
