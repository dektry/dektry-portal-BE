import { Injectable } from '@nestjs/common';
import { getCandidates } from './candidates';
import { InjectRepository } from '@nestjs/typeorm';
import { candidateRepository } from '../repositories/candidate.repository';
import { CandidateEntity } from '../entity/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(candidateRepository)
    private candidateRepository: candidateRepository,
  ) {}

  async getCandidatesList(): Promise<CandidateEntity[]> {
    return await this.candidateRepository.find();
  }

  async getCandidate(id): Promise<CandidateEntity> {
    return await this.candidateRepository.findOne(id, {
      relations: ['languages', 'education', 'experience'],
    });
  }
}
