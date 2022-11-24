import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerLevelEntity } from '../entity/careerLevel.entity';
import { levelRepository } from '../repositories/level.repository';
import { DeleteResult } from 'typeorm';
import { LevelDto } from '../dto/level.dto';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(levelRepository)
    private careerLevelRepository: levelRepository,
  ) {}

  async getAll(): Promise<CareerLevelEntity[]> {
    try {
      return await this.careerLevelRepository.find({});
    } catch (error) {
      console.error('[LEVELS_GET_ERROR]', error);
      Logger.error(error);

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createLevel(levelProps: LevelDto): Promise<CareerLevelEntity> {
    try {
      const { name } = levelProps;

      const isExist = await this.careerLevelRepository.findOne({
        name,
      });

      if (isExist) {
        throw new ConflictException(`Level '${name}' is already exist!`);
      }

      const newCareerLevelEntity =
        this.careerLevelRepository.create(levelProps);

      return this.careerLevelRepository.save(newCareerLevelEntity);
    } catch (error) {
      console.error('[LEVELS_CREATION_ERROR]', error);
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

  async updateLevel(
    id: string,
    newRoleProps: LevelDto,
  ): Promise<CareerLevelEntity> {
    try {
      const level = await this.careerLevelRepository.findOne(id);

      if (!level) {
        throw new NotFoundException(`Level with ID ${id} not found`);
      }

      return await this.careerLevelRepository.save({
        ...level,
        ...newRoleProps,
      });
    } catch (error) {
      console.error('[LEVELS_UPDATE_ERROR]', error);
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

  async deleteLevel(id: string): Promise<DeleteResult> {
    try {
      const deletedLevel = await this.careerLevelRepository.findOne({
        name: 'Deleted level',
      });

      if (deletedLevel?.id === id) {
        throw new ConflictException(`You can't remove deleted level!`);
      }

      const result = await this.careerLevelRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Level with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[LEVELS_DELETE_ERROR]', error);
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
}
