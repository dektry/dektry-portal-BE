import { EntityRepository, Repository } from 'typeorm';
import { SkillLevelsList } from 'users/entity/skillLevelsList.entity';

@EntityRepository(SkillLevelsList)
export class skillLevelsList extends Repository<SkillLevelsList> {}
