import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { employeeRepository } from '../repositories/employee.repository';
import { softSkillToSoftAssessmentRepository } from '../repositories/softSkilltoSoftAssessment.repository';
import { softAssessmentRepository } from '../repositories/softAssessment.repository';

import { EmployeeEntity } from 'employee/entity/employee.entity';
import { SoftSkillToSoftAssessmentEntity } from 'employee/entity/softSkillToSoftAssessment.entity';

import {
  ICompleteSoftAssessmentBody,
  IEditSoftAssessmentBody,
  softSkillAssessmentCantComplete,
  employeeNotFound,
  softSkillAssessmentNotFound,
  softSkillAssessmentCantEdit,
} from '../utils/constants';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

@Injectable()
export class EmployeeSoftAssessmentService {
  constructor(
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(softSkillToSoftAssessmentRepository)
    private softSkillToSoftAssessmentRepository: softSkillToSoftAssessmentRepository,
    @InjectRepository(softAssessmentRepository)
    private softAssessmentRepository: softAssessmentRepository,
  ) {}

  async completeAssessment(softAssessment: ICompleteSoftAssessmentBody) {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const savedInterview = await this.softAssessmentRepository.save({
        employee,
        comment: softAssessment.comment,
      });

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
  ): Promise<SoftAssessmentEntity> {
    try {
      const softAssessment: SoftAssessmentEntity =
        await this.softAssessmentRepository.findOne({
          where: {
            id: assessmentId,
          },
          relations: ['skills', 'skills.soft_skill_id'],
        });

      if (!softAssessment)
        throw new HttpException(
          softSkillAssessmentNotFound,
          HttpStatus.BAD_REQUEST,
        );

      return softAssessment;
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
  ): Promise<SoftAssessmentEntity[]> {
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
          relations: ['skills', 'skills.soft_skill_id'],
        });

      return softAssessments;
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
  ): Promise<SoftAssessmentEntity> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      await this.softAssessmentRepository.update(
        { id: assessmentId },
        {
          comment: softAssessment.comment,
        },
      );

      const softSkillsIds = softAssessment.softSkills.map((skill) => skill.id);

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
