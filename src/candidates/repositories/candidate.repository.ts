import { EntityRepository, Repository } from 'typeorm';
import { CandidateEntity } from '../entity/candidate.entity';

@EntityRepository(CandidateEntity)
export class candidateRepository extends Repository<CandidateEntity> {}
