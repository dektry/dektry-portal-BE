import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
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
import { softSkillMatrixRepository } from '../../users/repositories/softSkillMatrix.repository';

import { EmployeeEntity } from '../entity/employee.entity';
import { SoftSkillToSoftAssessmentEntity } from '../entity/softSkillToSoftAssessment.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { CareerLevelEntity } from 'users/entity/careerLevel.entity';
import { SoftAssessmentEntity } from '../entity/softAssessment.entity';

import { SoftSkillMatrixService } from '../../users/services/softSkillMatrix.service';

import { formatSoftAssessments } from 'employee/utils/formatSoftAssessments';

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
  EditSoftInterviewDto,
} from '../dto/softAssessment.dto';
import { Helper } from 'utils/helpers';

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
    @InjectRepository(softSkillMatrixRepository)
    private softSkillMatrixRepository: softSkillMatrixRepository,
    @Inject(SoftSkillMatrixService)
    private readonly softSkillMatrixService: SoftSkillMatrixService,
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

  async editAssessment(assessmentId: string, assessment: EditSoftInterviewDto) {
    try {
      const prevResultsOfAssessment: SoftAssessmentEntity =
        await this.softAssessmentRepository.findOne({
          where: {
            id: assessmentId,
          },
        });

      if (!prevResultsOfAssessment)
        throw new HttpException(
          softSkillAssessmentNotFound,
          HttpStatus.BAD_REQUEST,
        );

      const assessmentSkillsPrevGrades: SoftSkillToSoftAssessmentEntity[] =
        await this.softSkillToSoftAssessmentRepository.find({
          where: {
            id: In(assessment.grades.map((grade) => grade.gradeId)),
          },
        });

      //update selected assessment skills grades (A, B, C...)
      if (assessmentSkillsPrevGrades.length) {
        for (const grade of assessmentSkillsPrevGrades) {
          for (const gradeFromPayload of assessment.grades) {
            if (
              grade.id === gradeFromPayload.gradeId &&
              (grade.value !== gradeFromPayload.value ||
                grade.comment !== gradeFromPayload.comment)
            ) {
              await this.softSkillToSoftAssessmentRepository.update(
                { id: grade.id },
                {
                  value: gradeFromPayload.value,
                  comment: gradeFromPayload.comment,
                },
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('[EDIT_SOFT_SKILL_ASSESSMENT_ERROR]', error);
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
        softSkillAssessmentCantEdit,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssessmentResult(assessmentId: string) {
    try {
      const helper = new Helper();

      const softAssessment: SoftAssessmentEntity =
        await this.softAssessmentRepository.findOne({
          where: {
            id: assessmentId,
          },
          relations: ['skills', 'skills.soft_skill_id', 'position', 'level'],
        });

      if (!softAssessment)
        throw new HttpException(
          softSkillAssessmentNotFound,
          HttpStatus.BAD_REQUEST,
        );

      const matrix = await this.softSkillMatrixService.getDetailsByPositionId(
        softAssessment.position.id,
      );

      const answers = helper.getSoftAssessmentAnswers(softAssessment, matrix);

      const processedAssessment = {
        id: softAssessment.id,
        position: softAssessment.position.name,
        level: softAssessment.level.name,
        comment: softAssessment.comment,
        created: softAssessment.created,
        answers: answers,
      };

      return processedAssessment;
    } catch (err) {
      console.error('[SOFT_SKILL_ASSESSMENT_RESULT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        softSkillAssessmentNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
          type: item.type,
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

  async getInterviewById(interviewId: string) {
    try {
      const interviews = await this.softAssessmentRepository.findOne({
        relations: ['position', 'level', 'skills', 'skills.soft_skill_id'],
        where: {
          id: interviewId,
        },
      });

      const matrixId = await this.softSkillMatrixRepository.query(
        `
          SELECT id 
              FROM public."softSkillMatrix" WHERE position_id = $1
        `,
        [interviews.position.id],
      );

      if (!matrixId?.length)
        throw new HttpException('Interview not found', HttpStatus.BAD_REQUEST);

      const softSkillMatrix = await this.softSkillMatrixService.getDetails(
        matrixId[0]?.id,
      );

      //formatting matrix for FE Interview edit page
      for (let i = 0; i < interviews.skills.length; i++) {
        for (let j = 0; j < softSkillMatrix.skills.length; j++) {
          if (
            softSkillMatrix.skills[j]?.id ===
            interviews.skills[i]?.soft_skill_id.id
          ) {
            softSkillMatrix.skills[j]['currentSkillLevel'] = {
              id: interviews.skills[i].id,
              value: interviews.skills[i].value,
              comment: interviews.skills[i].comment,
            };
          }
        }
      }

      //added interview assessment date created
      softSkillMatrix['created'] = interviews.created;

      //added interview assessment level(middle/senior...)
      softSkillMatrix['level'] = {
        id: interviews.level.id,
        name: interviews.level.name,
      };

      return softSkillMatrix;
    } catch (error) {
      console.error('[EMPLOYEE_GET_ONE_SOFT_ASSESSMENT_ERROR]', error);
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

  async getSoftAssessmentComparison(employeeId: string) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        employeeId,
      );
      if (!employee)
        throw new HttpException('Employee not found', HttpStatus.BAD_REQUEST);

      const softAssessments = await this.softAssessmentRepository.find({
        where: {
          employee: employee,
        },
        relations: ['skills', 'skills.soft_skill_id'],
      });

      const result = formatSoftAssessments(softAssessments);

      return result;
    } catch (err) {
      console.error('[SOFT_SKILL_ASSESSMENT_RESULT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        softSkillAssessmentNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
