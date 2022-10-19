import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, getRepository } from 'typeorm';

import { softSkillToCvRepository } from '../repositories/softSkillToCv.repository';
import { employeeRepository } from 'employee/repositories/employee.repository';
import { EmployeeEntity } from 'employee/entity/employee.entity';
import {
  softSkillToCvNotFound,
  employeeNotFound,
  softSkillsToCvCantBeCreated,
} from 'employee/utils/constants';

type getSoftSkillsToCvListParams = {
  limit: number;
  order?: 'ASC' | 'DESC';
  query?: string;
  employeeId?: string;
};

@Injectable()
export class SoftSkillToCvService {
  constructor(
    @InjectRepository(softSkillToCvRepository)
    private softSkillToCvRepository: softSkillToCvRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
  ) {}

  async createSoftSkillsToCv(skills: string[], id: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const skillsToCvNames = skills.map((skill) => skill.toLowerCase());

      const existingSoftSkillsToCv = await this.softSkillToCvRepository.find({
        where: {
          name: In(skillsToCvNames),
        },
      });

      const newSoftSkillsToCv = [];
      const hash = {};

      for (const exists of existingSoftSkillsToCv) {
        hash[exists.name] = exists.id;
      }

      for (const softSkillToCv of skillsToCvNames) {
        if (!hash[softSkillToCv.toLowerCase()]) {
          newSoftSkillsToCv.push(
            this.softSkillToCvRepository.create({
              name: softSkillToCv?.toLowerCase(),
            }),
          );
        }
      }

      await this.softSkillToCvRepository.save(newSoftSkillsToCv);

      const softSkillsToCvOfCurrentEmployee =
        await this.softSkillToCvRepository.find({
          where: {
            name: In(skillsToCvNames),
          },
        });

      const actualRelationships = await getRepository(EmployeeEntity)
        .createQueryBuilder()
        .relation(EmployeeEntity, 'softSkillsToCv')
        .of(employee)
        .loadMany();

      await getRepository(EmployeeEntity)
        .createQueryBuilder()
        .relation(EmployeeEntity, 'softSkillsToCv')
        .of(employee)
        .addAndRemove(softSkillsToCvOfCurrentEmployee, actualRelationships);

      return HttpStatus.CREATED;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : softSkillsToCvCantBeCreated,
        err?.status,
      );
    }
  }

  async getSoftSkillsToCvList({
    limit,
    order,
    query,
  }: getSoftSkillsToCvListParams) {
    try {
      return await this.softSkillToCvRepository
        .createQueryBuilder('soft_skill_to_cv')
        .where('soft_skill_to_cv.name ILIKE :query', {
          query: `%${query ? query.trim() : ''}%`,
        })
        .take(limit)
        .orderBy(
          order
            ? {
                [`soft_skill_to_cv.name`]: order,
              }
            : {},
        )
        .getManyAndCount();
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : softSkillToCvNotFound,
        err?.status,
      );
    }
  }

  async getSoftSkillsToCvOfEmployee(id: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: {
          id: id,
        },
        relations: ['softSkillsToCv'],
      });

      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const skillsToCvNames = employee.softSkillsToCv.map((skill) =>
        skill.name.toLowerCase(),
      );

      return await this.softSkillToCvRepository.find({
        where: {
          name: In(skillsToCvNames),
        },
      });
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : softSkillToCvNotFound,
        err?.status,
      );
    }
  }

  async deleteSoftSkillToCv(id: string) {
    try {
      return await this.softSkillToCvRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : softSkillToCvNotFound,
        err?.status,
      );
    }
  }
}
