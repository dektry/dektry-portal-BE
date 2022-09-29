import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as moment from 'moment';

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
  softSkillAssessmentExist,
} from '../utils/constants';
import { SoftAssessmentEntity } from 'employee/entity/softAssessment.entity';

@Injectable()
export class SoftInterviewService {
  constructor(
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
    @InjectRepository(softSkillToSoftAssessmentRepository)
    private softSkillToSoftAssessmentRepository: softSkillToSoftAssessmentRepository,
    @InjectRepository(softAssessmentRepository)
    private softAssessmentRepository: softAssessmentRepository,
  ) {}

  async completeInterview(softAssessment: ICompleteSoftAssessmentBody) {
    try {
      const dateNow = moment().format();

      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const isSoftInerviewExist = await this.softAssessmentRepository.findOne({
        where: {
          employee: softAssessment.employeeId,
        },
      });

      if (isSoftInerviewExist)
        throw new HttpException(
          softSkillAssessmentExist,
          HttpStatus.BAD_REQUEST,
        );

      const savedInterview = await this.softAssessmentRepository.save({
        employee,
        createdAt: dateNow,
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

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillAssessmentCantComplete,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getInterviewResult(emplyeeId: string): Promise<SoftAssessmentEntity> {
    try {
      const softAssessment: SoftAssessmentEntity =
        await this.softAssessmentRepository.findOne({
          where: {
            employee: emplyeeId,
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

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillAssessmentNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editInterviewResult(
    softAssessment: IEditSoftAssessmentBody,
  ): Promise<SoftAssessmentEntity> {
    try {
      const employee: EmployeeEntity = await this.employeeRepository.findOne(
        softAssessment.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      await this.softAssessmentRepository.update(
        { employee: employee },
        {
          comment: softAssessment.comment,
        },
      );

      for (const activeSkillToUpdate of softAssessment.softSkills) {
        const { id } = await this.softSkillToSoftAssessmentRepository.findOne({
          where: {
            soft_skill_id: activeSkillToUpdate.id,
          },
        });
        await this.softSkillToSoftAssessmentRepository.update(
          { id },
          {
            softSkillScoreId: activeSkillToUpdate.softSkillScoreId,
            comment: activeSkillToUpdate.comment,
          },
        );
      }

      return await this.getInterviewResult(softAssessment.employeeId);
    } catch (err) {
      console.error('[EDIT_SOFT_SKILL_INTERVIEW_ERROR]', err);
      Logger.error(err);

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillAssessmentCantEdit,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}