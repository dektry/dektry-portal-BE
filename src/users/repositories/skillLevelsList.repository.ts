import { EntityRepository, Repository } from 'typeorm';
import { SkillLevelsListEntity } from 'users/entity/skillLevelsList.entity';

@EntityRepository(SkillLevelsListEntity)
export class skillLevelsListRepository extends Repository<SkillLevelsListEntity> {}
