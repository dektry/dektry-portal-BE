import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { candidateRepository } from '../repositories/candidate.repository';
import { CandidateEntity } from '../entity/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(candidateRepository)
    private candidateRepository: candidateRepository,
  ) {}

  async getCandidatesList(
    limit: number,
    page: number,
    order?: 'ASC' | 'DESC',
    field?: string,
  ): Promise<[CandidateEntity[], number]> {
    return await this.candidateRepository.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...(order
        ? {
            order: {
              [field]: order,
            },
          }
        : {}),
    });
  }

  async getCandidate(id): Promise<CandidateEntity> {
    return await this.candidateRepository.findOne(id, {
      relations: ['languages', 'education', 'experience'],
    });
  }
}
