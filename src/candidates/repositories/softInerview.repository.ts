import { EntityRepository, Repository } from 'typeorm';
import { SoftInterviewEntity } from '../entity/softInterview.entity';

@EntityRepository(SoftInterviewEntity)
export class softInterviewRepository extends Repository<SoftInterviewEntity> {}
