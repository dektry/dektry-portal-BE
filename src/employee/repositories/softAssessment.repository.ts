import { EntityRepository, Repository } from 'typeorm';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

@EntityRepository(SoftAssessmentEntity)
export class softAssessmentRepository extends Repository<SoftAssessmentEntity> {}
