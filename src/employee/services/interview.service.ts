import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as moment from 'moment';
import { DeleteResult, In } from 'typeorm';

import { positionRepository } from 'users/repositories/position.repository';
import { employeeSkillToInterviewRepository } from '../repositories/skillToInterview.repository';
import { employeeInterviewRepository } from '../repositories/interview.repository';
import { employeeRepository } from '../repositories/employee.repository';
import { levelRepository } from 'users/repositories/level.repository';
import { skillRepository } from '../../users/repositories/skill.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { SkillEntity } from 'users/entity/skill.entity';
import { SkillToInterviewEntity } from '../entity/skillToInterview.entity';
import { InterviewEntity } from '../entity/interview.entity';
import { CareerLevelEntity } from '../../users/entity/careerLevel.entity';
import { SkillsToLevelsEntity } from 'users/entity/skillsToLevels.entity';

import {
  interviewIsOver,
  IAnswer,
  interviewWasNotDeleted,
} from 'candidates/utils/constants';
import {
  employeeNotFound,
  ICompletedInterviewResponse,
  ICompleteInterview,
  IEditInterviewBody,
  IDeletedInterviewResponse,
} from '../utils/constants';

import { Helper } from 'utils/helpers';

@Injectable()
export class EmployeeInterviewService {
  constructor(
    @InjectRepository(employeeInterviewRepository)
    private interviewRepository: employeeInterviewRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(employeeSkillToInterviewRepository)
    private skillToInterviewRepository: employeeSkillToInterviewRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(levelRepository)
    private levelRepository: levelRepository,
    @InjectRepository(skillRepository)
    private skillRepository: skillRepository,
  ) {}
  async completeInterview(
    interview: ICompleteInterview,
    datetimeOfCreation?: string,
  ): Promise<ICompletedInterviewResponse> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        interview.employeeId,
      );

      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const isInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            employee: employee,
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

      const savedInterview = await this.interviewRepository.save({
        employee,
        createdAt: datetimeOfCreation || dateNow,
        position,
        level,
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
      console.error('[COMPLETE_EMPLOYEE_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editInterview(
    interview: IEditInterviewBody,
  ): Promise<ICompletedInterviewResponse> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        interview.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const prevResultsOfInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            employee: employee,
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

      const filteredSkills: SkillEntity[] = await this.skillRepository.find({
        where: {
          id: In(Object.keys(interview.answers)),
        },
      });

      await this.interviewRepository.update(
        { id: prevResultsOfInterview.id },
        {
          employee,
          position,
          level,
          isApproved: interview.isApproved,
          comment: interview.comment ?? null,
        },
      );

      const savedInterview: InterviewEntity =
        await this.interviewRepository.findOne({
          where: {
            employee,
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
      console.error('[EDIT_EMPLOYEE_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInterviewResult(
    interviewId: string,
  ): Promise<ICompletedInterviewResponse> {
    try {
      const helper = new Helper();

      const interview: InterviewEntity = await this.interviewRepository.findOne(
        {
          where: {
            id: interviewId,
          },
          relations: ['level', 'position'],
        },
      );

      if (interview) {
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
      throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('[GET_EMPLOYEE_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllInterviews(employeeId: string): Promise<InterviewEntity[]> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const interviews: InterviewEntity[] = await this.interviewRepository.find(
        {
          where: {
            employee: employee,
          },
          relations: ['level', 'position'],
        },
      );

      if (interviews?.length) {
        return interviews;
      }
      throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('[GET_ALL_INTERVIEWS_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteInterviewResult(
    employeeId: string,
  ): Promise<IDeletedInterviewResponse> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const interviewWasDeleted: DeleteResult =
        await this.interviewRepository.delete({
          employee,
        });

      if (interviewWasDeleted) {
        return {
          answer: 'Interview was deleted successfully',
        };
      }
      throw new HttpException(interviewWasNotDeleted, HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('[DELETE_EMPLOYEE_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) return error?.response;

      throw new HttpException(
        employeeNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
