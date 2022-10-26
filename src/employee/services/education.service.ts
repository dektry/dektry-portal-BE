import { Injectable, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { educationRepository } from '../repositories/education.repository';
import { employeeRepository } from '../repositories/employee.repository';

import { EducationDto } from '../dto/education.dto';

import {
  educationNotFound,
  educationCantBeSaved,
  employeeNotFound,
} from '../utils/constants';
import { formatEducation } from '../utils/formatEducation';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(educationRepository)
    private educationRepository: educationRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
  ) {}

  async getEducation(id: string) {
    try {
      const employee = this.employeeRepository.findOne(id);
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const education = await this.educationRepository.find({
        where: {
          employee: employee,
        },
      });

      return education;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : educationNotFound,
        err?.status,
      );
    }
  }

  async deleteEducation(id: string) {
    try {
      return await this.educationRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : educationNotFound,
        err?.status,
      );
    }
  }

  async editEducation(education: EducationDto) {
    try {
      const employee = await this.employeeRepository.findOne(
        education.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const formattedEducation = formatEducation(education, employee);
      await this.educationRepository.update(education.id, formattedEducation);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : educationCantBeSaved,
        err?.status,
      );
    }
  }

  async createEducation(education: EducationDto) {
    try {
      const employee = await this.employeeRepository.findOne(
        education.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const formattedEducation = formatEducation(education, employee);

      const created = await this.educationRepository
        .create(formattedEducation)
        .save();
      return created;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : educationCantBeSaved,
        err?.status,
      );
    }
  }
}
