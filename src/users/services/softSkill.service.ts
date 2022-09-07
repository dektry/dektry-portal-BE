import {
  Injectable,
  ConflictException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { softSkillRepository } from '../repositories/softSkill.repository';
import { softSkillScoreRepository } from '../repositories/softSkillScore.repository';
import { SoftSkillEntity } from '../entity/softSkill.entity';
import { SoftSkillScoreEntity } from '../entity/softSkillScore.entity';

import { SoftSkillDto } from '../dto/softSkill.dto';
import {
  softSkillCantCreate,
  softSkillCantGet,
  softSkillScoreCantGet,
} from '../utils/constant';

@Injectable()
export class SoftSkillService {
  constructor(
    @InjectRepository(softSkillRepository)
    private softSkillRepository: softSkillRepository,
    @InjectRepository(softSkillScoreRepository)
    private softSkillScoreRepository: softSkillScoreRepository,
  ) {}

  async getSoftSkillList(): Promise<SoftSkillEntity[]> {
    try {
      return await this.softSkillRepository.find();
    } catch (err) {
      console.error('[GET_SOFT_SKILL_ERROR]', err);
      Logger.error(err);

      throw new HttpException(softSkillCantGet, 500);
    }
  }
  async addSoftSkill({ value }: SoftSkillDto): Promise<SoftSkillEntity[]> {
    try {
      const isAlreadyExist = await this.softSkillRepository.findOne({ value });

      if (isAlreadyExist)
        throw new ConflictException(
          'Soft skill with this name is already exist!',
        );

      const newSoftSkill = await this.softSkillRepository.create({ value });

      await this.softSkillRepository.save(newSoftSkill);

      return this.getSoftSkillList();
    } catch (err) {
      console.error('[ADD_SOFT_SKILL_ERROR]', err);
      Logger.error(err);

      if (err?.response?.message) return err?.response;

      throw new HttpException(softSkillCantCreate, 500);
    }
  }

  /* score */
  async getSoftSkillScoreList(): Promise<SoftSkillScoreEntity[]> {
    try {
      return await this.softSkillScoreRepository.find();
    } catch (err) {
      console.error('[GET_SOFT_SKILL_ERROR]', err);
      Logger.error(err);

      throw new HttpException(softSkillScoreCantGet, 500);
    }
  }
}
