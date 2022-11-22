import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { experienceRepository } from '../repositories/experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(experienceRepository)
    private experienceRepository: experienceRepository,
  ) {}
}
