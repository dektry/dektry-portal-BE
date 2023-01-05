import {
  Injectable,
  ConflictException,
  HttpException,
  NotFoundException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { softSkillRepository } from '../repositories/softSkill.repository';
import { softSkillScoreRepository } from '../repositories/softSkillScore.repository';
import { positionRepository } from '../repositories/position.repository';
import { softSkillMatrixRepository } from '../repositories/softSkillMatrix.repository';
import { softSkillsToLevelsRepository } from '../repositories/softSkillsToLevels.repository';

import { SoftSkillEntity } from '../entity/softSkill.entity';
import { SoftSkillScoreEntity } from '../entity/softSkillScore.entity';

import {
  SoftSkillDto,
  SoftSkillMatrixCreateDto,
  SoftSkillMatrixGetAllDto,
  SoftSkillMatrixGetDetailsDto,
  SoftSkillMatrixCopyDto,
  SoftSkillMatrixCopyResponseDto,
} from '../dto/softSkillMatrix.dto';
import { SoftSkillMatrix } from 'users/entity/softSkillMatrix.entity';

@Injectable()
export class SoftSkillMatrixService {
  constructor(
    @InjectRepository(softSkillRepository)
    private softSkillRepository: softSkillRepository,
    @InjectRepository(softSkillsToLevelsRepository)
    private softSkillsToLevelsRepository: softSkillsToLevelsRepository,
    @InjectRepository(softSkillMatrixRepository)
    private softSkillMatrixRepository: softSkillMatrixRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(softSkillScoreRepository)
    private softSkillScoreRepository: softSkillScoreRepository,
  ) {}

  async create(payload: SoftSkillMatrixCreateDto) {
    try {
      const position = await this.positionRepository.findOne({
        where: { id: payload.positionId },
      });

      if (!position) {
        throw new NotFoundException(
          `Position with such id '${payload.positionId}' not found`,
        );
      }

      const isMatrixWithSuchPositionExist =
        await this.softSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.softSkillMatrixRepository.save({ position });

      for (let skill of payload.skills) {
        let createdSkill = await this.softSkillRepository.save({
          value: skill.value,
          softSkillMatrix: matrix,
        });

        //add skill grades
        await this.softSkillsToLevelsRepository.save(
          skill.levels.map((level) => {
            return this.softSkillsToLevelsRepository.create({
              skill_id: { id: createdSkill.id },
              level_id: { id: level.level_id.id },
              value: level.value,
              description: level.description,
            });
          }),
        );
      }
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_CREATION_ERROR]', error);
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

  async getAll(): Promise<SoftSkillMatrixGetAllDto[]> {
    try {
      return await this.softSkillMatrixRepository.find({
        relations: ['position'],
      });
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_GET_ALL_ERROR]', error);
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

  async getDetails(id: string): Promise<SoftSkillMatrixGetDetailsDto> {
    try {
      const matrix = await this.softSkillMatrixRepository.findOne({
        where: { id },
        relations: [
          'position',
          'skills',
          'skills.levels',
          'skills.levels.level_id',
        ],
      });

      if (!matrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      return matrix;
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_GET_DETAILS_ERROR]', error);
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

  async deleteSoftSkillMatrix(id: string): Promise<DeleteResult> {
    try {
      const result = await this.softSkillMatrixRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Matrix with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_DELETE_ERROR]', error);
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

  async copy(
    payload: SoftSkillMatrixCopyDto,
  ): Promise<SoftSkillMatrixCopyResponseDto> {
    try {
      const position = await this.positionRepository.findOne({
        where: { id: payload.positionId },
      });

      if (!position) {
        throw new NotFoundException(
          `Position with such id '${payload.positionId}' not found`,
        );
      }

      const isMatrixWithSuchPositionExist =
        await this.softSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.softSkillMatrixRepository.save({ position });
      const copiedMatrix: SoftSkillMatrixGetDetailsDto = await this.getDetails(
        payload.softSkillMatrixId,
      );

      for (let skill of copiedMatrix.skills) {
        let createdSkill = await this.softSkillRepository.save({
          value: skill.value,
          softSkillMatrix: matrix,
        });

        //add skill grades
        await this.softSkillsToLevelsRepository.save(
          skill.levels.map((level) => {
            return this.softSkillsToLevelsRepository.create({
              skill_id: { id: createdSkill.id },
              level_id: { id: level.level_id.id },
              value: level.value,
              description: level.description,
            });
          }),
        );
      }

      return { softSkillMatrixId: matrix.id };
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_COPY_ERROR]', error);
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
}
