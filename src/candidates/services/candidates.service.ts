import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { candidateRepository } from '../repositories/candidate.repository';
import { CandidateEntity } from '../entity/candidate.entity';

type getCandidatesListParams = {
  limit: number;
  page: number;
  order?: 'ASC' | 'DESC';
  field?: string;
  query?: string;
};

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(candidateRepository)
    private candidateRepository: candidateRepository,
  ) {}

  async getCandidatesList({
    limit,
    page,
    order,
    field,
    query,
  }: getCandidatesListParams): Promise<[CandidateEntity[], number]> {
    return await this.candidateRepository
      .createQueryBuilder('candidate')
      .where('candidate.fullName ILIKE :query', {
        query: `%${query ? query.trim() : ''}%`,
      })
      .skip(limit * (page - 1))
      .take(limit)
      .orderBy(
        order
          ? {
              [`candidate.${field}`]: order,
            }
          : {},
      )
      .getManyAndCount();
  }

  async getCandidate(id): Promise<CandidateEntity> {
    return await this.candidateRepository.findOne(id, {
      relations: ['languages', 'education', 'experience'],
    });
  }
}
