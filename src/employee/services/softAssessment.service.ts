import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { softSkillToSoftAssessmentRepository } from '../repositories/softSkilltoSoftAssessment.repository';
import { softAssessmentRepository } from '../repositories/softAssessment.repository';
import { positionRepository } from 'users/repositories/position.repository';
import { levelRepository } from 'users/repositories/level.repository';
import { questionToSoftSkillRepository } from 'employee/repositories/questionToSkill.repository';

import { EmployeeEntity } from 'employee/entity/employee.entity';
import { SoftSkillToSoftAssessmentEntity } from 'employee/entity/softSkillToSoftAssessment.entity';
import { PositionEntity } from 'users/entity/position.entity';
import { CareerLevelEntity } from 'users/entity/careerLevel.entity';

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
} from '../utils/constants';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';
import { QuestionToSoftSkillEntity } from 'employee/entity/questionToSoftSkill.entity';

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

  async completeAssessment(softAssessment: ICompleteSoftAssessmentBody) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        softAssessment.positionId,
      );

      if (!position)
        throw new HttpException(positionNotFound, HttpStatus.BAD_REQUEST);

      const level: CareerLevelEntity = await this.levelRepository.findOne(
        softAssessment.levelId,
      );

      if (!level)
        throw new HttpException(levelNotFound, HttpStatus.BAD_REQUEST);

      const savedInterview = await this.softAssessmentRepository.save({
        employee,
        comment: softAssessment.comment,
        position,
        level,
        successfullySaved: true,
      });

      const assessmentQuestions: Partial<QuestionToSoftSkillEntity>[] = [];

      const assessmentSkills: SoftSkillToSoftAssessmentEntity[] =
        softAssessment.softSkills.map((skill) => {
          return this.softSkillToSoftAssessmentRepository.create({
            soft_assessment_id: savedInterview,
            soft_skill_id: { id: skill.id, value: skill.value },
            comment: skill.comment,
            softSkillScoreId: skill.softSkillScoreId,
          });
        });

      await this.softSkillToSoftAssessmentRepository.save(assessmentSkills);

      const savedSkills = await this.softSkillToSoftAssessmentRepository.find({
        where: {
          soft_assessment_id: savedInterview,
        },
        relations: ['soft_skill_id'],
      });

      for (let i = 0; i < savedSkills.length; i++) {
        const skill = softAssessment.softSkills.find(
          (el) => el.value === savedSkills[i].soft_skill_id.value,
        );

        if (skill && skill.questions) {
          skill.questions.forEach((el) => {
            assessmentQuestions.push({
              id: el.id,
              soft_skill_id: savedSkills[i],
              value: el.value,
            });
          });
        }
      }

      await this.questionToSoftSkillRepository.save(assessmentQuestions);

      return savedInterview;
    } catch (err) {
      console.error('[COMPLETE_SOFT_SKILL_ASSESSMENT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        softSkillAssessmentCantComplete,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssessmentResult(
    assessmentId: string,
  ): Promise<ISoftAssessmentResultResponse> {
    try {
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

      const processedSkills: ISoftSkill[] = [];
      for (const skill of softAssessment.skills) {
        const questions = await this.questionToSoftSkillRepository.find({
          where: {
            soft_skill_id: skill.id,
          },
        });
        processedSkills.push({
          ...skill,
          questions: questions,
          value: skill.soft_skill_id.value,
        });
      }
      const processedAssessment = {
        id: softAssessment.id,
        position: softAssessment.position,
        level: softAssessment.level,
        comment: softAssessment.comment,
        createdAt: softAssessment.createdAt,
        skills: processedSkills,
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

  async getSoftAssessments(
    employeeId: string,
  ): Promise<ISoftAssessmentResultResponse[]> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne({
        id: employeeId,
      });
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const softAssessments: SoftAssessmentEntity[] =
        await this.softAssessmentRepository.find({
          where: {
            employee: employee,
          },
          relations: ['skills', 'skills.soft_skill_id', 'position', 'level'],
        });

      const processedAssessments = [];
      for (const assessment of softAssessments) {
        const processedSkills = [];
        for (const skill of assessment.skills) {
          const questions = await this.questionToSoftSkillRepository.find({
            where: {
              soft_skill_id: skill.id,
            },
          });
          processedSkills.push({
            id: skill.id,
            softSkillScoreId: skill.softSkillScoreId,
            value: skill.soft_skill_id.value,
            questions: questions,
          });
        }
        processedAssessments.push({
          id: assessment.id,
          comment: assessment.comment,
          position: assessment.position,
          level: assessment.level,
          createdAt: assessment.createdAt,
          skills: processedSkills,
        });
      }

      return processedAssessments;
    } catch (err) {
      console.error('[SOFT_SKILL_ASSESSMENTS_GET_ERROR]', err);
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

  async editAssessmentResult(
    assessmentId: string,
    softAssessment: IEditSoftAssessmentBody,
  ): Promise<ISoftAssessmentResultResponse> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const existingAssessment = await this.softAssessmentRepository.findOne({
        where: {
          id: assessmentId,
        },
        relations: ['skills'],
      });

      if (!existingAssessment)
        throw new HttpException(
          softSkillAssessmentNotFound,
          HttpStatus.BAD_REQUEST,
        );

      for (const skill of existingAssessment.skills) {
        const skillRemaining = softAssessment.softSkills.find(
          (el) => el.id === skill.id,
        );

        if (!skillRemaining) {
          await this.softSkillToSoftAssessmentRepository.delete(skill.id);
        }

        const existingQuestions = await this.questionToSoftSkillRepository.find(
          {
            where: {
              soft_skill_id: skill.id,
            },
          },
        );

        for (const question of existingQuestions) {
          const questionRemaining = skillRemaining.questions.find(
            (el) => el.id === question.id,
          );

          if (!questionRemaining) {
            await this.questionToSoftSkillRepository.delete(question.id);
          }
        }
      }

      await this.softAssessmentRepository.update(
        { id: assessmentId },
        {
          comment: softAssessment.comment,
        },
      );

      const softSkillsIds = softAssessment.softSkills.map((skill) => skill.id);

      if (softAssessment.softSkills && softAssessment.softSkills.length) {
        for (const activeSkillToUpdate of softAssessment.softSkills) {
          await this.softSkillToSoftAssessmentRepository.update(
            {
              id: In(softSkillsIds),
            },
            {
              softSkillScoreId: activeSkillToUpdate.softSkillScoreId,
              comment: activeSkillToUpdate.comment,
            },
          );

          if (
            activeSkillToUpdate.questions &&
            activeSkillToUpdate.questions.length
          ) {
            for (const questionToUpdate of activeSkillToUpdate.questions) {
              await this.questionToSoftSkillRepository.update(
                {
                  id: questionToUpdate.id,
                },
                {
                  value: questionToUpdate.value,
                },
              );
            }
          }
        }
      }

      return await this.getAssessmentResult(assessmentId);
    } catch (err) {
      console.error('[EDIT_SOFT_SKILL_ASSESSMENT_ERROR]', err);
      Logger.error(err);

      if (err?.response) {
        throw new HttpException(
          { status: err?.status, message: err?.response },
          err?.status,
        );
      }

      throw new HttpException(
        softSkillAssessmentCantEdit,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
