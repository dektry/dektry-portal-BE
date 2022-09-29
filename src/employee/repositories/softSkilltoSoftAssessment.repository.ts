import { EntityRepository, Repository } from 'typeorm';
import { SoftSkillToSoftAssessmentEntity } from 'employee/entity/softSkillToSoftAssessment.entity';

@EntityRepository(SoftSkillToSoftAssessmentEntity)
export class softSkillToSoftAssessmentRepository extends Repository<SoftSkillToSoftAssessmentEntity> {}
