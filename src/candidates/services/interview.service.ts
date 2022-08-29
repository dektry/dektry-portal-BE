import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as moment from 'moment';
import { In } from 'typeorm';

import { positionRepository } from 'users/repositories/position.repository';
import { skillToInterviewRepository } from '../repositories/skillToInterview.repository';
import { interviewRepository } from '../repositories/interview.repository';
import { candidateRepository } from '../repositories/candidate.repository';

import { levelRepository } from 'users/repositories/level.repository';
import { skillRepository } from '../../users/repositories/skill.repository';

import { CandidateEntity } from 'candidates/entity/candidate.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { SkillEntity } from 'users/entity/skill.entity';
import { SkillToInterviewEntity } from 'candidates/entity/skillToInterview.entity';
import { InterviewEntity } from 'candidates/entity/interview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { SkillsToLevelsEntity } from 'users/entity/skillsToLevels.entity';

import {
  candidateNotFound,
  interviewIsOver,
  ICompleteInterview,
  IEditInterviewBody,
  IAnswer,
  ICompletedInterviewResponse,
} from 'candidates/utils/constants';
import { countReviewResult } from '../utils/helpers';
import { Helper } from 'utils/helpers';

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
  ) {}
  async completeInterview(
    interview: ICompleteInterview,
  ): Promise<ICompletedInterviewResponse> {
    try {
      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        interview.candidateId,
      );

      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      const isInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            candidate: candidate,
          },
        });

      if (isInterview)
        throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);

      const dateNow = moment().format();
      const helper = new Helper();

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level: CareerLevelEntity = await this.levelRepository.findOne(
        interview.levelId,
      );

      const filteredSkills: SkillEntity[] = await this.skillRepository.find({
        where: {
          id: In(Object.keys(interview.answers)),
        },
      });

      const result: number = await countReviewResult(interview, filteredSkills);
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

      const answers: IAnswer[] = await helper.getInterviewAnswers(
        savedInterview,
        SkillToInterviewEntity,
        SkillsToLevelsEntity,
      );

      return {
        interview: savedInterview,
        answers,
      };
    } catch (error) {
      console.error('[COMPLETE_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        candidateNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editInterview(
    interview: IEditInterviewBody,
  ): Promise<ICompletedInterviewResponse> {
    try {
      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        interview.candidateId,
      );

      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      const prevResultsOfInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            candidate: candidate,
          },
        });

      if (!prevResultsOfInterview)
        throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);

      const helper = new Helper();

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level: CareerLevelEntity = await this.levelRepository.findOne(
        interview.levelId,
      );

      await this.candidateRepository.update(
        { id: candidate.id },
        { level: level.name, position: position.name },
      );

      const filteredSkills: SkillEntity[] = await this.skillRepository.find({
        where: {
          id: In(Object.keys(interview.answers)),
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
          isOffered: interview.isOffered,
          comment: interview.comment ?? null,
        },
      );

      const savedInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            candidate,
          },
          relations: ['level', 'position'],
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

      const answers: IAnswer[] = await helper.getInterviewAnswers(
        savedInterview,
        SkillToInterviewEntity,
        SkillsToLevelsEntity,
      );

      return {
        interview: savedInterview,
        answers,
      };
    } catch (error) {
      console.error('[EDIT_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        candidateNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInterviewResult(
    candidateId: string,
  ): Promise<ICompletedInterviewResponse> {
    const candidate: CandidateEntity = await this.candidateRepository.findOne(
      candidateId,
    );
    if (!candidate)
      throw new HttpException('Candidate not found', HttpStatus.BAD_REQUEST);

    const interview: InterviewEntity = await this.interviewRepository.findOne({
      where: {
        candidate: candidate,
      },
      relations: ['level', 'position'],
    });

    if (interview) {
      const helper = new Helper();

      const answers = await helper.getInterviewAnswers(
        interview,
        SkillToInterviewEntity,
        SkillsToLevelsEntity,
      );
      return {
        interview,
        answers,
      };
    }
    return { interview };
  }
}
