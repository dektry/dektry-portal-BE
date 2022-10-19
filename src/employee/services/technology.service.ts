import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { technologyRepository } from '../repositories/technology.repository';
import { technologyNotFound } from '../utils/constants';

type getTechnologiesListParams = {
  limit: number;
  order?: 'ASC' | 'DESC';
  query?: string;
};

@Injectable()
export class TechnologyService {
  constructor(
    @InjectRepository(technologyRepository)
    private technologyRepository: technologyRepository,
  ) {}

  async getTechnologiesList({
    limit,
    order,
    query,
  }: getTechnologiesListParams) {
    try {
      return await this.technologyRepository
        .createQueryBuilder('technology')
        .where('technology.name ILIKE :query', {
          query: `%${query ? query.trim() : ''}%`,
        })
        .take(limit)
        .orderBy(
          order
            ? {
                [`technology.name`]: order,
              }
            : {},
        )
        .getManyAndCount();
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : technologyNotFound,
        err?.status,
      );
    }
  }

  async deleteTechnology(id: string) {
    try {
      return await this.technologyRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : technologyNotFound,
        err?.status,
      );
    }
  }
}
