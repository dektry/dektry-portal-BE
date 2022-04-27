import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { interviewRepository } from '../repositories/interview.repository';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(interviewRepository)
    private interviewRepository: interviewRepository,
  ) {}
}
