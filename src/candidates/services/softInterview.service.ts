import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as moment from 'moment';

import { candidateRepository } from '../repositories/candidate.repository';
import { softSkillToSoftInterviewRepository } from '../repositories/softSkillToSoftInterview.repository';
import { softInterviewRepository } from '../repositories/softInerview.repository';
import { positionRepository } from 'users/repositories/position.repository';
import { levelRepository } from 'users/repositories/level.repository';

import { CandidateEntity } from '../entity/candidate.entity';
import { SoftSkillToSoftInterviewEntity } from '../entity/softSkillToSoftInterview.entity';
import { PositionEntity } from 'users/entity/position.entity';

import {
  ICompleteSoftInterviewBody,
  IEditSoftInterviewBody,
  softSkillInterviewCantComplete,
  candidateNotFound,
  softSkillInterviewExist,
  softSkillInterviewNotFound,
  ISoftInterviewResultResponse,
  softSkillInterviewCantEdit,
} from '../utils/constants';

@Injectable()
export class SoftInterviewService {
  constructor(
    @InjectRepository(candidateRepository)
    private candidateRepository: candidateRepository,
    @InjectRepository(softSkillToSoftInterviewRepository)
    private softSkillToSoftInterviewRepository: softSkillToSoftInterviewRepository,
    @InjectRepository(softInterviewRepository)
    private softInterviewRepository: softInterviewRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(levelRepository)
    private levelRepository: levelRepository,
  ) {}

  async completeInterview(softInerview: ICompleteSoftInterviewBody) {
    try {
      const dateNow = moment().format();

      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        softInerview.candidateId,
      );
      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      const position: PositionEntity = await this.positionRepository.findOne(
        softInerview.positionId,
      );

      const level = await this.levelRepository.findOne(softInerview.levelId);

      const isSoftInerviewExist = await this.softInterviewRepository.findOne({
        where: {
          candidate: softInerview.candidateId,
        },
      });

      if (isSoftInerviewExist)
        throw new HttpException(
          softSkillInterviewExist,
          HttpStatus.BAD_REQUEST,
        );

      const savedInterview = await this.softInterviewRepository.save({
        candidate,
        createdAt: dateNow,
        hobby: softInerview.hobby,
        comment: softInerview.comment,
        position,
        level,
      });

      const interviewSkills: SoftSkillToSoftInterviewEntity[] =
        softInerview.softSkills.map((skill) => {
          return this.softSkillToSoftInterviewRepository.create({
            soft_interview_id: savedInterview,
            soft_skill_id: { id: skill.id, value: skill.value },
            comment: skill.comment,
            isActive: skill.isActive,
          });
        });

      await this.softSkillToSoftInterviewRepository.save(interviewSkills);
    } catch (err) {
      console.error('[COMPLETE_SOFT_SKILL_INTERVIEW_ERROR]', err);
      Logger.error(err);

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillInterviewCantComplete,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getInterviewResult(
    candidateId: string,
  ): Promise<ISoftInterviewResultResponse> {
    try {
      const isSoftInerview: ISoftInterviewResultResponse =
        await this.softInterviewRepository.findOne({
          where: {
            candidate: candidateId,
          },
          relations: ['skills', 'skills.soft_skill_id', 'position', 'level'],
        });

      if (!isSoftInerview)
        throw new HttpException(
          softSkillInterviewNotFound,
          HttpStatus.BAD_REQUEST,
        );

      return isSoftInerview;
    } catch (err) {
      console.error('[SOFT_SKILL_INTERVIEW_RESULT_ERROR]', err);
      Logger.error(err);

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillInterviewNotFound,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async editInterviewResult(
    softInerview: IEditSoftInterviewBody,
  ): Promise<ISoftInterviewResultResponse> {
    try {
      const candidate: CandidateEntity = await this.candidateRepository.findOne(
        softInerview.candidateId,
      );
      if (!candidate)
        throw new HttpException(candidateNotFound, HttpStatus.BAD_REQUEST);

      await this.softInterviewRepository.update(
        { candidate: candidate },
        {
          hobby: softInerview.hobby,
          comment: softInerview.comment,
        },
      );

      for (const activeSkillToUpdate of softInerview.softSkills) {
        const { id } = await this.softSkillToSoftInterviewRepository.findOne({
          where: {
            soft_skill_id: activeSkillToUpdate.id,
          },
        });
        await this.softSkillToSoftInterviewRepository.update(
          { id },
          {
            isActive: activeSkillToUpdate.isActive,
            comment: activeSkillToUpdate.comment,
          },
        );
      }

      return await this.getInterviewResult(softInerview.candidateId);
    } catch (err) {
      console.error('[EDIT_SOFT_SKILL_INTERVIEW_ERROR]', err);
      Logger.error(err);

      if (err?.response) return err?.response;

      throw new HttpException(
        softSkillInterviewCantEdit,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
