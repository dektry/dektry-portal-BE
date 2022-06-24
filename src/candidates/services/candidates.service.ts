import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { candidateRepository } from '../repositories/candidate.repository';
import { CandidateEntity } from '../entity/candidate.entity';
import { InterviewEntity } from 'candidates/entity/interview.entity';
import { UpdateCandidateDto } from '../dto/candidate.dto';

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
  ) { }

  async getCandidatesList({
    limit,
    page,
    order,
    field,
    query,
  }: getCandidatesListParams): Promise<[CandidateEntity[], number]> {
    return await this.candidateRepository
      .createQueryBuilder('candidate')
      .leftJoin(
        InterviewEntity,
        'interview',
        'interview.candidate_id = candidate.id',
      )
      .where('candidate.fullName ILIKE :query', {
        query: `%${query ? query.trim() : ''}%`,
      })
      .andWhere('interview.candidate_id IS NULL')
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

  async updateCandidate(
    id: string,
    updatedCandidate: UpdateCandidateDto,
  ): Promise<CandidateEntity | UpdateResult> {
    const updateResult = await this.candidateRepository.update(
      id,
      updatedCandidate,
    );

    if (!updateResult.affected) return updateResult;

    const candidate = await this.candidateRepository.findOne(id);

    // temporarily disabled to prevent data corruption in the PF
    // await updateCandidatePF(candidate.pfId, updatedCandidate);

    return candidate;
  }
}
