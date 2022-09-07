import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillScoreEntity } from '../entity/softSkillScore.entity';

@EntityRepository(SoftSkillScoreEntity)
export class softSkillScoreRepository extends Repository<SoftSkillScoreEntity> {}
