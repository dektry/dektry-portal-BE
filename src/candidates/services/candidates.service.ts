import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { candidateRepository } from '../repositories/candidate.repository';
import { CandidateEntity } from '../entity/candidate.entity';
import { UpdateCandidateDto } from '../dto/candidate.dto';

type getCandidatesListParams = {
  limit: number;
  page: number;
  order?: 'ASC' | 'DESC';
  field?: string;
  fullName?: string;
  woInterview?: string;
  woSoftInterview?: string;
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
    fullName,
    woInterview,
    woSoftInterview,
  }: getCandidatesListParams): Promise<[CandidateEntity[], number]> {
    const filterByTechInterview = JSON.parse(woInterview)
      ? 'interview.candidate_id IS NULL'
      : {};
    const filterBySoftInterview = JSON.parse(woSoftInterview)
      ? 'softInterview.candidate_id IS NULL'
      : {};

    return await this.candidateRepository
      .createQueryBuilder('candidate')
      .leftJoinAndSelect(
        'candidate.interview',
        'interview',
        'interview.candidate_id = candidate.id',
      )
      .leftJoinAndSelect(
        'candidate.softInterview',
        'softInterview',
        'softInterview.id = candidate.id',
      )
      .where('candidate.fullName ILIKE :query', {
        query: `%${fullName ? fullName.trim() : ''}%`,
      })
      .andWhere(filterByTechInterview)
      .andWhere(filterBySoftInterview)
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
