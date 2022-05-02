import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { positionRepository } from 'users/repositories/position.repository';
import { skillToInterviewRepository } from '../repositories/skillToInterview.repository';
import { interviewRepository } from '../repositories/interview.repository';
import { candidateRepository } from '../repositories/candidate.repository';
import { countReviewResult, getInterviewAnswers } from '../utils/helpers';
import { levelRepository } from 'users/repositories/level.repository';

export interface ICompleteInterview {
  candidateId: string;
  levelId: string;
  positionId: string;
  answers: {
    [key: string]: string;
  };
}

export interface IAnswer {
  skill: string;
  actual: string;
  desired: string;
  id: string;
}

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(interviewRepository)
    private interviewRepository: interviewRepository,
    @InjectRepository(candidateRepository)
    private candidateRepository: candidateRepository,
    @InjectRepository(skillToInterviewRepository)
    private skillToInterviewRepository: skillToInterviewRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(levelRepository)
    private levelRepository: levelRepository,
  ) {}
  async completeInterview(interview: ICompleteInterview) {
    const dateNow = moment().format();
    const candidate = await this.candidateRepository.findOne(
      interview.candidateId,
    );

    if (!candidate)
      throw new HttpException('Candidate not found', HttpStatus.BAD_REQUEST);

    const position = await this.positionRepository.findOne(
      interview.positionId,
    );
    const level = await this.levelRepository.findOne(interview.levelId);

    const savedInterview = await this.interviewRepository.save({
      candidate,
      createdAt: dateNow,
      position,
      level,
      result: await countReviewResult(interview),
    });

    const interviewSkills = Object.keys(interview.answers).map((key: any) => {
      return this.skillToInterviewRepository.create({
        interview_id: savedInterview,
        skill_id: key,
        value: interview.answers[key],
      });
    });

    await this.skillToInterviewRepository.save(interviewSkills);

    const answers = await getInterviewAnswers(savedInterview);

    return {
      interview: savedInterview,
      answers,
    };
  }

  async getInterviewResult(candidateId: string) {
    const candidate = await this.candidateRepository.findOne(candidateId);
    if (!candidate)
      throw new HttpException('Candidate not found', HttpStatus.BAD_REQUEST);

    const interview = await this.interviewRepository.findOne({
      where: {
        candidate: candidate,
      },
      relations: ['level', 'position'],
    });

    if (interview) {
      const answers = await getInterviewAnswers(interview);
      return {
        interview,
        answers,
      };
    }
    return { interview };
  }
}