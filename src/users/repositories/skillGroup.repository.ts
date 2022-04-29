import { EntityRepository, Repository } from 'typeorm';
import { SkillGroupEntity } from '../entity/skillGroup.entity';

@EntityRepository(SkillGroupEntity)
export class skillGroupRepository extends Repository<SkillGroupEntity> {}
