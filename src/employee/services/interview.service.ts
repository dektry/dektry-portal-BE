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
  interviewsNotFound,
} from 'candidates/utils/constants';
import {
  employeeNotFound,
  ICompletedInterviewResponse,
  ICompleteInterview,
  IEditInterviewBody,
  IDeletedInterviewResponse,
  techAssessmentCantBeSaved,
  techAssessmentIsNotFound,
} from '../utils/constants';
import {
  CompleteInterviewsDto,
  InterviewResultDto,
  InterviewAnswers,
  GetAllInterviewsDto,
} from '../dto/interviews.dto';

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

  async getInterviewResult(interviewId: string): Promise<InterviewResultDto> {
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
        const interviewForResponse = {
          created: interview.created,
          level: interview.level.name,
          position: interview.position.name,
        };
        return {
          ...interviewForResponse,
          answers,
        };
      }
      throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_RESULT_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async completeInterview(
    interview: CompleteInterviewsDto,
  ): Promise<InterviewResultDto> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        interview.employeeId,
      );

      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        interview.positionId,
      );
      const level: CareerLevelEntity = await this.levelRepository.findOne(
        interview.levelId,
      );

      const savedInterview = await this.interviewRepository.save({
        employee,
        position,
        level,
        comment: interview.comment ?? null,
      });

      const interviewSkillsGrades: SkillToInterviewEntity[] =
        interview.grades.map((grade) =>
          this.skillToInterviewRepository.create({
            interview_id: savedInterview,
            skill_id: { id: grade.skillId },
            value: grade.value,
          }),
        );

      await this.skillToInterviewRepository.save(interviewSkillsGrades);

      return await this.getInterviewResult(savedInterview.id);
    } catch (error) {
      console.error('[EMPLOYEE_INTERVIEW_COMPLETE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async editInterview(
  //   interview: IEditInterviewBody,
  // ): Promise<ICompletedInterviewResponse> {
  //   try {
  //     const employee: EmployeeEntity = await this.employeeRepository.findOne(
  //       interview.employeeId,
  //     );
  //     if (!employee)
  //       throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

  //     const prevResultsOfInterview: InterviewEntity =
  //       await this.interviewRepository.findOne({
  //         where: {
  //           employee: employee,
  //         },
  //       });

  //     if (!prevResultsOfInterview)
  //       throw new HttpException(interviewIsOver, HttpStatus.BAD_REQUEST);

  //     const helper = new Helper();

  //     const position: PositionEntity = await this.positionRepository.findOne(
  //       interview.positionId,
  //     );
  //     const level: CareerLevelEntity = await this.levelRepository.findOne(
  //       interview.levelId,
  //     );

  //     const filteredSkills: SkillEntity[] = await this.skillRepository.find({
  //       where: {
  //         id: In(Object.keys(interview.answers)),
  //       },
  //     });

  //     await this.interviewRepository.update(
  //       { id: prevResultsOfInterview.id },
  //       {
  //         employee,
  //         position,
  //         level,
  //         comment: interview.comment ?? null,
  //       },
  //     );

  //     const savedInterview: InterviewEntity =
  //       await this.interviewRepository.findOne({
  //         where: {
  //           employee,
  //         },
  //         relations: ['level'],
  //       });

  //     const existingAnswers: SkillToInterviewEntity[] =
  //       await this.skillToInterviewRepository.find({
  //         where: {
  //           interview_id: savedInterview,
  //           skill_id: In(Object.keys(interview.answers)),
  //         },
  //         relations: ['skill_id'],
  //       });

  //     for (const answerToUpdate of existingAnswers) {
  //       await this.skillToInterviewRepository.update(
  //         { id: answerToUpdate.id },
  //         {
  //           value: interview.answers[answerToUpdate.skill_id.id],
  //         },
  //       );
  //     }

  //     const newSkills: SkillEntity[] = filteredSkills.filter((skill) => {
  //       const isSkillRecorded = existingAnswers.find(
  //         (answer) => answer.skill_id.id === skill.id,
  //       );

  //       return !isSkillRecorded;
  //     });

  //     const interviewSkills: SkillToInterviewEntity[] = newSkills.map(
  //       (skill) => {
  //         return this.skillToInterviewRepository.create({
  //           interview_id: savedInterview,
  //           skill_id: skill,
  //           value: interview.answers[skill.id],
  //         });
  //       },
  //     );

  //     await this.skillToInterviewRepository.save(interviewSkills);

  //     const answers: IAnswer[] = await helper.getInterviewAnswers(
  //       savedInterview,
  //       SkillToInterviewEntity,
  //       SkillsToLevelsEntity,
  //     );
  //     return {
  //       interview: savedInterview,
  //       answers,
  //     };
  //   } catch (err) {
  //     Logger.error(err);

  //     throw new HttpException(
  //       err?.response
  //         ? { status: err?.status, message: err?.response }
  //         : techAssessmentCantBeSaved,
  //       err?.status,
  //     );
  //   }
  // }

  async getAllInterviews(employeeId: string): Promise<GetAllInterviewsDto[]> {
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
        return interviews.map((item) => ({
          created: item.created,
          updated: item.updated,
          type: item.type,
          id: item.id,
          position: item.position.name,
          level: item.level.name,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('[EMPLOYEE_ALL_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : techAssessmentIsNotFound,
        err?.status,
      );
    }
  }
}
