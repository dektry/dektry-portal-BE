import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerEntity } from 'users/entity/career.entity';
import { careerRepository } from 'users/repositories/career.repository';
import { DeleteResult } from 'typeorm';
import { UserEntity } from 'users/entity/user.entity';
import { PositionEntity } from 'users/entity/position.entity';

export interface CareerProps {
  user: UserEntity;
  salary: number;
  from: Date;
  to: Date;
  position: PositionEntity;
}

@Injectable()
export class CareerService {
  constructor(
    @InjectRepository(careerRepository)
    private careerRepository: careerRepository,
  ) {}

  async getByUser(id): Promise<CareerEntity[]> {
    const fullCareer = await this.careerRepository.find({
      where: { user: id },
      relations: ['user', 'position'],
    });
    return fullCareer;
  }

  async createCareer(careerProps: CareerProps): Promise<CareerEntity> {
    return this.careerRepository.save(careerProps);
  }

  async updateCareer(
    id: string,
    newCareerProps: CareerProps,
  ): Promise<CareerEntity> {
    const career = await this.careerRepository.findOne(id);

    const result = await this.careerRepository.save({
      ...career,
      ...newCareerProps,
    });
    return result;
  }

  async deleteCareer(id: string): Promise<DeleteResult> {
    try {
      const result = await this.careerRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Career with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
