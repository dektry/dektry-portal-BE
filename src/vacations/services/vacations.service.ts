import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { vacationRepository } from '../repositories/vacations.repository';
import { usersRepository } from 'users/repositories/users.repository';
import { VacationsEntity } from '../entity/vacations.entity';
import { SaveVacationDto } from '../dto/vacations.dto';
import { getAvailableTime } from '../utils/helpers';
import { DeleteResult } from 'typeorm';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(vacationRepository)
    private vacationRepository: vacationRepository,
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getVacationsList() {
    // isArchive?: boolean, // limit: number = 10, // page: number = 1,
    const allVacations = await this.vacationRepository.find();

    return allVacations;
  }

  async createVacation(body: SaveVacationDto): Promise<VacationsEntity> {
    const { user, policy, start, end, status, reason } = body;

    const [currentUser] = await this.usersRepository.find({
      where: { id: user.id },
    });

    const availableTime = getAvailableTime(start, end, currentUser.balance);

    if (availableTime > 0) {
      await this.usersRepository.save({
        ...currentUser,
        balance: availableTime,
      });
    } else {
      throw new NotFoundException(
        `Your current balance less than requested time`,
      );
    }

    const newVacation = await this.vacationRepository.save({
      user,
      policy,
      start,
      end,
      status,
      reason,
    });

    return newVacation;
  }

  async updateVacation(
    id: string,
    body: SaveVacationDto,
  ): Promise<VacationsEntity> {
    const { user, policy, start, end, status, reason } = body;

    const [currentVacation] = await this.vacationRepository.find({
      where: { id },
    });

    if (!currentVacation) {
      throw new NotFoundException(`Vacation with '${id}' already exists!`);
    }

    const [currentUser] = await this.usersRepository.find({
      where: { id: user.id },
    });

    const availableTime = getAvailableTime(start, end, currentUser.balance);

    if (availableTime > 0) {
      await this.usersRepository.save({
        ...currentUser,
        balance: availableTime,
      });
    } else {
      throw new NotFoundException(
        `Your current balance less than requested time`,
      );
    }

    const updatedVacation = await this.vacationRepository.save({
      ...currentVacation,
      user,
      policy,
      start,
      end,
      status,
      reason,
    });

    return updatedVacation;
  }

  async deleteVacation(id: string): Promise<DeleteResult> {
    try {
      const deletedVacation = await this.vacationRepository.delete(id);
      if (!deletedVacation.affected) {
        throw new NotFoundException(`Vacation with ID '${id}' not found`);
      } else {
        return deletedVacation;
      }
    } catch (error) {
      return error;
    }
  }
}
