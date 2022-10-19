import { Repository, EntityRepository } from 'typeorm';
import { SoftSkillToCvEntity } from '../entity/softSkillToCV.entity';

@EntityRepository(SoftSkillToCvEntity)
export class softSkillToCvRepository extends Repository<SoftSkillToCvEntity> {}
