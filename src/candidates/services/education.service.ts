import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { educationRepository } from '../repositories/education.repository';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(educationRepository)
    private educationRepository: educationRepository,
  ) {}
}
