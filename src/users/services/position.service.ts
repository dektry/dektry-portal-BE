import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from '../entity/position.entity';
import { positionRepository } from 'users/repositories/position.repository';
import { careerRepository } from '../repositories/career.repository';
import { DeleteResult } from 'typeorm';
import { PositionProps } from '../controllers/position.controller';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(careerRepository)
    private careerRepository: careerRepository,
  ) {}

  async getAll(): Promise<PositionEntity[]> {
    const allPositions = await this.positionRepository.find({
      relations: ['group', 'access'],
    });
    return allPositions;
  }

  async createPosition(positionProps: PositionProps): Promise<PositionEntity> {
    const { name } = positionProps;
    const isExist = await this.positionRepository.findOne({
      name,
    });
    if (isExist) {
      throw new ConflictException(`Position '${name}' is already exist!`);
    }
    const newPositionEntity = this.positionRepository.create(positionProps);
    return this.positionRepository.save(newPositionEntity);
  }

  async updatePosition(
    id: string,
    newRoleProps: PositionProps,
  ): Promise<PositionEntity> {
    const position = await this.positionRepository.findOne(id);
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    const result = await this.positionRepository.save({
      ...position,
      ...newRoleProps,
    });
    return result;
  }

  async deletePosition(id: string): Promise<DeleteResult> {
    try {
      const allCareersWithThisPosition = await this.careerRepository.find({
        where: { position: id },
      });
      const deletedPosition = await this.positionRepository.findOne({
        name: 'Deleted position',
      });
      const changedCareers = allCareersWithThisPosition.map((career) => {
        return this.careerRepository.create({
          ...career,
          position: deletedPosition,
        });
      });
      if (deletedPosition.id === id) {
        throw new ConflictException(`You can't remove deleted position!`);
      }
      await this.careerRepository.save(changedCareers);
      const result = await this.positionRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Position with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
