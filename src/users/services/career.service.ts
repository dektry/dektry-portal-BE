import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CareerEntity } from '../entity/career.entity';
import { careerRepository } from '../repositories/career.repository';
import { DeleteResult } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { PositionEntity } from '../entity/position.entity';
import { positionRepository } from '../repositories/position.repository';
import { usersRepository } from '../repositories/users.repository';

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
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(careerRepository)
    private careerRepository: careerRepository,
  ) {}

  async getByUser(id): Promise<CareerEntity[]> {
    const fullCareer = await this.careerRepository.find({
      where: { user: id },
      relations: ['user', 'position', 'position.group'],
    });
    return fullCareer;
  }

  async createCareer(careerProps: CareerProps): Promise<CareerEntity> {
    const position = await this.positionRepository.findOne(
      careerProps.position,
    );
    const user = await this.usersRepository.findOne(careerProps.user);
    if (!position) {
      throw new NotFoundException(
        `Position with ID '${careerProps.position}' not found`,
      );
    }
    if (!user) {
      throw new NotFoundException(
        `User with ID '${careerProps.user}' not found`,
      );
    }
    const result = await this.careerRepository.save({
      ...careerProps,
      position,
      user,
    });
    return result;
  }

  async updateCareer(
    id: string,
    newCareerProps: CareerProps,
  ): Promise<CareerEntity> {
    const career = await this.careerRepository.findOne(id);
    const position = await this.positionRepository.findOne(
      newCareerProps.position,
    );
    const user = await this.usersRepository.findOne(newCareerProps.user);
    if (!position) {
      throw new NotFoundException(
        `Position with ID '${newCareerProps.position}' not found`,
      );
    }
    if (!user) {
      throw new NotFoundException(
        `User with ID '${newCareerProps.user}' not found`,
      );
    }
    const result = await this.careerRepository.save({
      ...career,
      ...newCareerProps,
      position,
      user,
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
