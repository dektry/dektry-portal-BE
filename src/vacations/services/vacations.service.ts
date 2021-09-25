import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, ILike } from 'typeorm';
import * as map from 'lodash/map';
import { vacationRepository } from '../repositories/vacations.repository';
import { usersRepository } from 'users/repositories/users.repository';
import { VacationsEntity } from '../entity/vacations.entity';
import { SaveVacationDto } from '../dto/vacations.dto';
import { getBusinessTime } from '../utils/helpers';
import {
  vacationStatuses,
  policyType,
  typeBusinessTime,
  vacationStatusesArray,
} from '../utils/constants';

@Injectable()
export class VacationsService {
  constructor(
    @InjectRepository(vacationRepository)
    private vacationRepository: vacationRepository,
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getVacationsList(userId: string, status: string, name: string) {
    // isArchive?: boolean, // limit: number = 10, // page: number = 1,
    const isStatusTypeAll = status === 'all';
    let allVacations;
    let statusOptions;

    if (userId) {
      statusOptions = isStatusTypeAll ? In(vacationStatusesArray) : status;
      allVacations = await this.vacationRepository.find({
        where: { user: { id: userId }, status: statusOptions },
      });
    } else {
      statusOptions = isStatusTypeAll ? vacationStatusesArray : [status];
      allVacations = await this.vacationRepository
        .createQueryBuilder('vacations')
        .leftJoinAndSelect('vacations.user', 'user')
        .where('vacations.status IN (:...status)', {
          status: statusOptions,
        })
        .andWhere(
          name
            ? 'user.firstName ILike :name OR user.lastName ILike :name'
            : '1=1',
          {
            name: `%${name}%`,
          },
        )
        // .addOrderBy(
        //   filter === 'latest' ? 'topic.created_at' : 'topic.repliesCount',
        //   'DESC',
        // )
        .getMany();
    }
    console.log('allVacations', allVacations);
    return allVacations;
  }

  async createVacation(body: SaveVacationDto): Promise<VacationsEntity> {
    const { user, policy, start, end, status, reason } = body;

    const newVacation = await this.vacationRepository.save({
      user,
      policy,
      start,
      end,
      status: vacationStatuses.submitted,
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

    if (
      currentVacation.status === vacationStatuses.submitted &&
      status === vacationStatuses.approved &&
      policy === policyType.vac
    ) {
      const availableTime = getBusinessTime(start, end, currentUser.balance);

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
    } else if (
      (currentVacation.status === vacationStatuses.approved &&
        status === vacationStatuses.submitted &&
        policy === policyType.vac) ||
      (currentVacation.status === vacationStatuses.approved &&
        status === vacationStatuses.denied &&
        policy === policyType.vac)
    ) {
      const restoreTime = getBusinessTime(
        currentVacation.start,
        currentVacation.end,
        currentUser.balance,
        typeBusinessTime.restore,
      );

      await this.usersRepository.save({
        ...currentUser,
        balance: restoreTime,
      });
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
