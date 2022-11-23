import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { DeleteResult } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from '../entity/position.entity';
import { positionRepository } from '../repositories/position.repository';

import { PositionDto } from '../dto/position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
  ) {}

  async getAll(): Promise<PositionEntity[]> {
    try {
      const allPositions = await this.positionRepository.find({});

      return allPositions;
    } catch (error) {
      console.error('[POSITION_GET_ERROR]', error);
      Logger.error(error);

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPosition(positionProps: PositionDto): Promise<PositionEntity> {
    try {
      const { name } = positionProps;

      const isExist = await this.positionRepository.findOne({
        name,
      });

      if (isExist) {
        throw new ConflictException(`Position '${name}' is already exist!`);
      }

      const newPositionEntity = this.positionRepository.create(positionProps);

      return this.positionRepository.save(newPositionEntity);
    } catch (error) {
      console.error('[POSITION_CREATION_ERROR]', error);
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

  async updatePosition(
    id: string,
    newPositionProps: PositionDto,
  ): Promise<PositionEntity> {
    try {
      const position = await this.positionRepository.findOne(id);

      if (!position) {
        throw new NotFoundException(`Position with ID ${id} not found`);
      }
      const result = await this.positionRepository.save({
        ...position,
        ...newPositionProps,
      });
      return result;
    } catch (error) {
      console.error('[POSITION_UPDATE_ERROR]', error);
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

  async deletePosition(id: string): Promise<DeleteResult> {
    try {
      const deletedPosition = await this.positionRepository.findOne({
        name: 'Deleted position',
      });

      if (deletedPosition?.id === id) {
        throw new ConflictException(`You can't remove deleted position!`);
      }

      const result = await this.positionRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Position with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[POSITION_DELETE_ERROR]', error);
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
