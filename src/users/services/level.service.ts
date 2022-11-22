import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerLevelEntity } from '../entity/careerLevel.entity';
import { levelRepository } from '../repositories/level.repository';
import { DeleteResult } from 'typeorm';
import { LevelProps } from '../controllers/level.controller';

@Injectable()
export class LevelsService {
  constructor(
    @InjectRepository(levelRepository)
    private careerLevelRepository: levelRepository,
  ) {}

  async getAll(): Promise<CareerLevelEntity[]> {
    return await this.careerLevelRepository.find({});
  }

  async createLevel(levelProps: LevelProps): Promise<CareerLevelEntity> {
    const { name } = levelProps;
    const isExist = await this.careerLevelRepository.findOne({
      name,
    });
    if (isExist) {
      throw new ConflictException(`Level '${name}' is already exist!`);
    }
    const newCareerLevelEntity = this.careerLevelRepository.create(levelProps);
    return this.careerLevelRepository.save(newCareerLevelEntity);
  }

  async updateLevel(
    id: string,
    newRoleProps: LevelProps,
  ): Promise<CareerLevelEntity> {
    const level = await this.careerLevelRepository.findOne(id);
    if (!level) {
      throw new NotFoundException(`Level with ID ${id} not found`);
    }
    return await this.careerLevelRepository.save({
      ...level,
      ...newRoleProps,
    });
  }

  async deleteLevel(id: string): Promise<DeleteResult> {
    try {
      const deletedLevel = await this.careerLevelRepository.findOne({
        name: 'Deleted level',
      });

      if (deletedLevel.id === id) {
        throw new ConflictException(`You can't remove deleted level!`);
      }

      const result = await this.careerLevelRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Level with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.log(error, 'huy');
      return error;
    }
  }
}
