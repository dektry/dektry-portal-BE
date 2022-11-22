import { Injectable, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { languageRepository } from '../repositories/language.repository';
import { employeeRepository } from '../repositories/employee.repository';

import { LanguageDto } from '../dto/language.dto';

import {
  languageNotFound,
  languageCantBeSaved,
  employeeNotFound,
  languages,
  languageLevels,
  languageOrLevelIsWrong,
} from '../utils/constants';
import { formatLanguage } from '../utils/formatLanguage';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(languageRepository)
    private languageRepository: languageRepository,
    @InjectRepository(employeeRepository)
    private employeeRepository: employeeRepository,
  ) {}

  async getLanguages(id: string) {
    try {
      const employee = this.employeeRepository.findOne(id);
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      const languages = await this.languageRepository.find({
        where: {
          employee: employee,
        },
      });

      return languages;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : languageNotFound,
        err?.status,
      );
    }
  }

  async deleteLanguage(id: string) {
    try {
      return await this.languageRepository.delete(id);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : languageNotFound,
        err?.status,
      );
    }
  }

  async editLanguage(language: LanguageDto) {
    try {
      const employee = await this.employeeRepository.findOne(
        language.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      if (!languages[language.value] || !languageLevels[language.level])
        throw new HttpException(languageOrLevelIsWrong, HttpStatus.BAD_REQUEST);

      const formattedLanguage = formatLanguage(language, employee);
      await this.languageRepository.update(language.id, formattedLanguage);
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : languageCantBeSaved,
        err?.status,
      );
    }
  }

  async createLanguage(language: LanguageDto) {
    try {
      const employee = await this.employeeRepository.findOne(
        language.employeeId,
      );
      if (!employee)
        throw new HttpException(employeeNotFound, HttpStatus.BAD_REQUEST);

      if (
        !languages[language.value] ||
        (!languageLevels[language.level] &&
          languageLevels[language.level] !== 0)
      )
        throw new HttpException(languageOrLevelIsWrong, HttpStatus.BAD_REQUEST);

      const formattedLanguage = formatLanguage(language, employee);

      const created = await this.languageRepository
        .create(formattedLanguage)
        .save();
      return created;
    } catch (err) {
      Logger.error(err);

      throw new HttpException(
        err?.response
          ? { status: err?.status, message: err?.response }
          : languageCantBeSaved,
        err?.status,
      );
    }
  }
}
