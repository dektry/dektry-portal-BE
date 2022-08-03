import { EntityRepository, Repository } from 'typeorm';
import { InterviewEntity } from '../entity/interview.entity';

@EntityRepository(InterviewEntity)
export class employeeInterviewRepository extends Repository<InterviewEntity> {}
