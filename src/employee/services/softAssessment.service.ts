import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, DeleteResult } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { softSkillToSoftAssessmentRepository } from '../repositories/softSkilltoSoftAssessment.repository';
import { softAssessmentRepository } from '../repositories/softAssessment.repository';
import { positionRepository } from 'users/repositories/position.repository';
import { levelRepository } from 'users/repositories/level.repository';
import { questionToSoftSkillRepository } from '../repositories/questionToSkill.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { SoftSkillToSoftAssessmentEntity } from '../entity/softSkillToSoftAssessment.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { CareerLevelEntity } from 'users/entity/careerLevel.entity';
import { SoftAssessmentEntity } from '../entity/softAssessment.entity';
import { QuestionToSoftSkillEntity } from '../entity/questionToSoftSkill.entity';

import {
  ICompleteSoftAssessmentBody,
  IEditSoftAssessmentBody,
  softSkillAssessmentCantComplete,
  employeeNotFound,
  softSkillAssessmentNotFound,
  softSkillAssessmentCantEdit,
  positionNotFound,
  levelNotFound,
  ISoftSkill,
  ISoftAssessmentResultResponse,
  ISoftAssessment,
} from '../utils/constants';
import {
  CompleteSoftInterviewsDto,
  GetAllSoftInterviewsDto,
} from '../dto/softAssessment.dto';

@Injectable()
export class EmployeeSoftAssessmentService {
  constructor(
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(softSkillToSoftAssessmentRepository)
    private softSkillToSoftAssessmentRepository: softSkillToSoftAssessmentRepository,
    @InjectRepository(softAssessmentRepository)
    private softAssessmentRepository: softAssessmentRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(levelRepository)
    private levelRepository: levelRepository,
    @InjectRepository(questionToSoftSkillRepository)
    private questionToSoftSkillRepository: questionToSoftSkillRepository,
  ) {}

  async completeAssessment(payload: CompleteSoftInterviewsDto) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        payload.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        payload.positionId,
      );

      if (!position)
        throw new HttpException(positionNotFound, HttpStatus.BAD_REQUEST);

      const level: CareerLevelEntity = await this.levelRepository.findOne(
        payload.levelId,
      );

      if (!level)
        throw new HttpException(levelNotFound, HttpStatus.BAD_REQUEST);

      const savedInterview = await this.softAssessmentRepository.save({
        employee,
        position,
        level,
      });

      const assessmentSkills: SoftSkillToSoftAssessmentEntity[] =
        payload.grades.map((grade) => {
          return this.softSkillToSoftAssessmentRepository.create({
            soft_assessment_id: savedInterview,
            soft_skill_id: { id: grade.skillId },
            comment: grade.comment ?? '',
            value: grade.value,
          });
        });

      await this.softSkillToSoftAssessmentRepository.save(assessmentSkills);
    } catch (error) {
      console.error('[COMPLETE_SOFT_SKILL_ASSESSMENT_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(
        softSkillAssessmentCantComplete,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async getAssessmentResult(assessmentId: string): Promise<ISoftAssessment> {
  //   try {
  //     const softAssessment: SoftAssessmentEntity =
  //       await this.softAssessmentRepository.findOne({
  //         where: {
  //           id: assessmentId,
  //         },
  //         relations: ['skills', 'skills.soft_skill_id', 'position', 'level'],
  //       });

  //     if (!softAssessment)
  //       throw new HttpException(
  //         softSkillAssessmentNotFound,
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     const processedSkills: ISoftSkill[] = [];
  //     for (const skill of softAssessment.skills) {
  //       const questions = await this.questionToSoftSkillRepository.find({
  //         where: {
  //           soft_skill_id: skill.id,
  //         },
  //       });
  //       processedSkills.push({
  //         ...skill,
  //         questions: questions,
  //         value: skill.soft_skill_id.value,
  //       });
  //     }
  //     const processedAssessment = {
  //       id: softAssessment.id,
  //       position: softAssessment.position,
  //       level: softAssessment.level,
  //       comment: softAssessment.comment,
  //       createdAt: softAssessment.created,
  //       skills: processedSkills,
  //     };

  //     return processedAssessment;
  //   } catch (err) {
  //     console.error('[SOFT_SKILL_ASSESSMENT_RESULT_ERROR]', err);
  //     Logger.error(err);

  //     if (err?.response) {
  //       throw new HttpException(
  //         { status: err?.status, message: err?.response },
  //         err?.status,
  //       );
  //     }

  //     throw new HttpException(
  //       softSkillAssessmentNotFound,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async getAllInterviews(
    employeeId: string,
  ): Promise<GetAllSoftInterviewsDto[]> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const interviews: SoftAssessmentEntity[] =
        await this.softAssessmentRepository.find({
          where: {
            employee: employee,
          },
          relations: ['level', 'position'],
        });

      if (interviews?.length) {
        return interviews.map((item) => ({
          created: item.created,
          updated: item.updated,
          id: item.id,
          position: item.position.name,
          level: item.level.name,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('[EMPLOYEE_ALL_SOFT_INTERVIEW_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // async editAssessmentResult(
  //   assessmentId: string,
  //   softAssessment: IEditSoftAssessmentBody,
  // ): Promise<ISoftAssessmentResultResponse> {
  //   try {
  //     const employee: EmployeeEntity = await this.employeeRepository.findOne(
  //       softAssessment.employeeId,
  //     );
  //     if (!employee)
  //       throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

  //     const existingAssessment = await this.softAssessmentRepository.findOne({
  //       where: {
  //         id: assessmentId,
  //       },
  //       relations: ['skills'],
  //     });

  //     if (!existingAssessment)
  //       throw new HttpException(
  //         softSkillAssessmentNotFound,
  //         HttpStatus.BAD_REQUEST,
  //       );

  //     for (const skill of existingAssessment.skills) {
  //       const skillRemaining = softAssessment.softSkills.find(
  //         (el) => el.id === skill.id,
  //       );

  //       if (!skillRemaining) {
  //         await this.softSkillToSoftAssessmentRepository.delete(skill.id);
  //       }

  //       const existingQuestions = await this.questionToSoftSkillRepository.find(
  //         {
  //           where: {
  //             soft_skill_id: skill.id,
  //           },
  //         },
  //       );

  //       for (const question of existingQuestions) {
  //         const questionRemaining = skillRemaining.questions.find(
  //           (el) => el.id === question.id,
  //         );

  //         if (!questionRemaining) {
  //           await this.questionToSoftSkillRepository.delete(question.id);
  //         }
  //       }
  //     }

  //     await this.softAssessmentRepository.update(
  //       { id: assessmentId },
  //       {
  //         comment: softAssessment.comment,
  //       },
  //     );

  //     const softSkillsIds = softAssessment.softSkills.map((skill) => skill.id);

  //     if (softAssessment.softSkills && softAssessment.softSkills.length) {
  //       for (const activeSkillToUpdate of softAssessment.softSkills) {
  //         await this.softSkillToSoftAssessmentRepository.update(
  //           {
  //             id: In(softSkillsIds),
  //           },
  //           {
  //             softSkillScoreId: activeSkillToUpdate.softSkillScoreId,
  //             comment: activeSkillToUpdate.comment,
  //           },
  //         );

  //         if (
  //           activeSkillToUpdate.questions &&
  //           activeSkillToUpdate.questions.length
  //         ) {
  //           for (const questionToUpdate of activeSkillToUpdate.questions) {
  //             await this.questionToSoftSkillRepository.update(
  //               {
  //                 id: questionToUpdate.id,
  //               },
  //               {
  //                 value: questionToUpdate.value,
  //               },
  //             );
  //           }
  //         }
  //       }
  //     }

  //     const savedSoftAssessment = await this.softAssessmentRepository.findOne({
  //       where: {
  //         id: existingAssessment.id,
  //       },
  //       relations: ['skills'],
  //     });
  //     const allSkillsIds = savedSoftAssessment.skills.map((skill) => skill.id);
  //     const savedQuestions = await this.questionToSoftSkillRepository.find({
  //       id: In(allSkillsIds),
  //     });
  //     return {
  //       assessment: savedSoftAssessment,
  //       questions: savedQuestions,
  //     };
  //   } catch (err) {
  //     console.error('[EDIT_SOFT_SKILL_ASSESSMENT_ERROR]', err);
  //     Logger.error(err);

  //     if (err?.response) {
  //       throw new HttpException(
  //         { status: err?.status, message: err?.response },
  //         err?.status,
  //       );
  //     }

  //     throw new HttpException(
  //       softSkillAssessmentCantEdit,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async deleteInterviewResult(id: string) {
    try {
      const interviewWasDeleted: DeleteResult =
        await this.softAssessmentRepository.delete(id);

      if (!interviewWasDeleted.affected) {
        throw new NotFoundException(`Intreview with ID '${id}' not found`);
      }
    } catch (error) {
      console.error('[EMPLOYEE_SOFT_INTERVIEW_DELETE_ERROR]', error);
      Logger.error(error);

      throw new HttpException(
        error?.response
          ? {
              status: error?.status,
              message: error?.response?.message ?? error?.response,
            }
          : 'Interview not found',
        error?.status,
      );
    }
  }
}
