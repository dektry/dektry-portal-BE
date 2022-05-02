import { EntityRepository, Repository } from 'typeorm';
import { InterviewEntity } from '../entity/interview.entity';

@EntityRepository(InterviewEntity)
export class interviewRepository extends Repository<InterviewEntity> {}
