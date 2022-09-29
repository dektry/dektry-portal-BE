import { EntityRepository, Repository } from 'typeorm';
import { QuestionToSoftSkillEntity } from 'employee/entity/questionToSoftSkill.entity';

@EntityRepository(QuestionToSoftSkillEntity)
export class questionToSoftSkillRepository extends Repository<QuestionToSoftSkillEntity> {}
