import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { positionRepository } from 'users/repositories/position.repository';
import { skillToInterviewRepository } from '../repositories/skillToInterview.repository';
import { interviewRepository } from '../repositories/interview.repository';
import { candidateRepository } from '../repositories/candidate.repository';
import { countReviewResult, getInterviewAnswers } from '../utils/helpers';
import { levelRepository } from 'users/repositories/level.repository';
import { skillRepository } from '../../users/repositories/skill.repository';
import { In } from 'typeorm';
import { candidateNotFound } from 'candidates/utils/constants';
import { CandidateEntity } from 'candidates/entity/candidate.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { SkillEntity } from 'users/entity/skill.entity';
import { SkillToInterviewEntity } from 'candidates/entity/skillToInterview.entity';
import { InterviewEntity } from 'candidates/entity/interview.entity';

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
    @InjectRepository(skillRepository)
    private skillRepository: skillRepository,
  ) { }
  async completeInterview(interview: ICompleteInterview) {
    try {
      const dateNow = moment().format();
      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        interview.candidateId,
      );

      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level = await this.levelRepository.findOne(interview.levelId);

      const filteredSkills: SkillEntity[] = await this.skillRepository.find({
        where: {
          id: In(Object.keys(interview.answers)),
        },
      });

      const result = await countReviewResult(interview, filteredSkills);
      const savedInterview = await this.interviewRepository.save({
        candidate,
        createdAt: dateNow,
        position,
        level,
        result,
      });

      const interviewSkills: SkillToInterviewEntity[] = filteredSkills.map(
        (skill) => {
          return this.skillToInterviewRepository.create({
            interview_id: savedInterview,
            skill_id: skill,
            value: interview.answers[skill.id],
          });
        },
      );

      await this.skillToInterviewRepository.save(interviewSkills);

      const answers: IAnswer[] = await getInterviewAnswers(savedInterview);

      return {
        interview: savedInterview,
        answers,
      };
    } catch (error) {
      console.error('[COMPLETE_INTERVIEW_ERROR]', error);
      throw new HttpException(error.text, 500);
    }
  }

  async editInterview(interview: ICompleteInterview) {
    try {
      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        interview.candidateId,
      );

      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level = await this.levelRepository.findOne(interview.levelId);

      const filteredSkills: SkillEntity[] = await this.skillRepository.find({
        where: {
          id: In(Object.keys(interview.answers)),
        },
      });

      const prevResultsOfInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            candidate,
          },
        });

      const result = await countReviewResult(interview, filteredSkills);
      await this.interviewRepository.update(
        { id: prevResultsOfInterview.id },
        {
          candidate,
          position,
          level,
          result,
        },
      );

      const savedInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            candidate,
          },
          relations: ['level'],
        });

      const existingAnswers: SkillToInterviewEntity[] =
        await this.skillToInterviewRepository.find({
          where: {
            interview_id: savedInterview,
            skill_id: In(Object.keys(interview.answers)),
          },
          relations: ['skill_id'],
        });

      for (const answerToUpdate of existingAnswers) {
        await this.skillToInterviewRepository.update(
          { id: answerToUpdate.id },
          {
            value: interview.answers[answerToUpdate.skill_id.id],
          },
        );
      }

      const newSkills: SkillEntity[] = filteredSkills.filter((skill) => {
        const isSkillRecorded = existingAnswers.find(
          (answer) => answer.skill_id.id === skill.id,
        );

        return !isSkillRecorded;
      });

      const interviewSkills: SkillToInterviewEntity[] = newSkills.map(
        (skill) => {
          return this.skillToInterviewRepository.create({
            interview_id: savedInterview,
            skill_id: skill,
            value: interview.answers[skill.id],
          });
        },
      );

      await this.skillToInterviewRepository.save(interviewSkills);

      const answers: IAnswer[] = await getInterviewAnswers(savedInterview);

      return {
        interview: savedInterview,
        answers,
      };
    } catch (error) {
      console.error('[EDIT_INTERVIEW_ERROR]', error);
      throw new HttpException(error.text, 500);
    }
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
