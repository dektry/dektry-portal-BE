import {
  Injectable,
  ConflictException,
  HttpException,
  NotFoundException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { softSkillRepository } from '../repositories/softSkill.repository';
import { softSkillScoreRepository } from '../repositories/softSkillScore.repository';
import { positionRepository } from '../repositories/position.repository';
import { softSkillMatrixRepository } from '../repositories/softSkillMatrix.repository';
import { softSkillsToLevelsRepository } from '../repositories/softSkillsToLevels.repository';

import { SoftSkillEntity } from '../entity/softSkill.entity';
import { SoftSkillScoreEntity } from '../entity/softSkillScore.entity';

import {
  SoftSkillMatrixCreateDto,
  SoftSkillMatrixGetAllDto,
  SoftSkillMatrixGetDetailsDto,
  SoftSkillMatrixCopyDto,
  SoftSkillMatrixCopyResponseDto,
  SoftSkillMatrixUpdateDto,
} from '../dto/softSkillMatrix.dto';
import { SoftSkillMatrix } from 'users/entity/softSkillMatrix.entity';

@Injectable()
export class SoftSkillMatrixService {
  constructor(
    @InjectRepository(softSkillRepository)
    private softSkillRepository: softSkillRepository,
    @InjectRepository(softSkillsToLevelsRepository)
    private softSkillsToLevelsRepository: softSkillsToLevelsRepository,
    @InjectRepository(softSkillMatrixRepository)
    private softSkillMatrixRepository: softSkillMatrixRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(softSkillScoreRepository)
    private softSkillScoreRepository: softSkillScoreRepository,
  ) {}

  async create(payload: SoftSkillMatrixCreateDto) {
    try {
      const position = await this.positionRepository.findOne({
        where: { id: payload.positionId },
      });

      if (!position) {
        throw new NotFoundException(
          `Position with such id '${payload.positionId}' not found`,
        );
      }

      const isMatrixWithSuchPositionExist =
        await this.softSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.softSkillMatrixRepository.save({ position });

      for (let skill of payload.skills) {
        let createdSkill = await this.softSkillRepository.save({
          value: skill.value,
          softSkillMatrix: matrix,
        });

        //add skill grades
        await this.softSkillsToLevelsRepository.save(
          skill.levels.map((level) => {
            return this.softSkillsToLevelsRepository.create({
              skill_id: { id: createdSkill.id },
              level_id: { id: level.level_id.id },
              value: level.value,
              description: level.description,
            });
          }),
        );
      }
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_CREATION_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<SoftSkillMatrixGetAllDto[]> {
    try {
      return await this.softSkillMatrixRepository.find({
        relations: ['position'],
      });
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_GET_ALL_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDetails(id: string): Promise<SoftSkillMatrixGetDetailsDto> {
    try {
      const matrix = await this.softSkillMatrixRepository.findOne({
        where: { id },
        relations: [
          'position',
          'skills',
          'skills.levels',
          'skills.levels.level_id',
        ],
      });

      if (!matrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      return matrix;
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_GET_DETAILS_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteSoftSkillMatrix(id: string): Promise<DeleteResult> {
    try {
      const result = await this.softSkillMatrixRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Matrix with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_DELETE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async copy(
    payload: SoftSkillMatrixCopyDto,
  ): Promise<SoftSkillMatrixCopyResponseDto> {
    try {
      const position = await this.positionRepository.findOne({
        where: { id: payload.positionId },
      });

      if (!position) {
        throw new NotFoundException(
          `Position with such id '${payload.positionId}' not found`,
        );
      }

      const isMatrixWithSuchPositionExist =
        await this.softSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.softSkillMatrixRepository.save({ position });
      const copiedMatrix: SoftSkillMatrixGetDetailsDto = await this.getDetails(
        payload.softSkillMatrixId,
      );

      for (let skill of copiedMatrix.skills) {
        let createdSkill = await this.softSkillRepository.save({
          value: skill.value,
          softSkillMatrix: matrix,
        });

        //add skill grades
        await this.softSkillsToLevelsRepository.save(
          skill.levels.map((level) => {
            return this.softSkillsToLevelsRepository.create({
              skill_id: { id: createdSkill.id },
              level_id: { id: level.level_id.id },
              value: level.value,
              description: level.description,
            });
          }),
        );
      }

      return { softSkillMatrixId: matrix.id };
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_COPY_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(payload: SoftSkillMatrixUpdateDto, id: string) {
    try {
      const prevSavedMatrix: SoftSkillMatrixGetDetailsDto =
        await this.getDetails(id);

      if (!prevSavedMatrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      //update position
      if (prevSavedMatrix.position.id !== payload.positionId) {
        const isMatrixWithSuchPositionExist =
          await this.softSkillMatrixRepository.findOne({
            where: {
              position: { id: payload.positionId },
            },
          });

        if (isMatrixWithSuchPositionExist) {
          throw new ConflictException(
            `Matrix with such position(${payload.positionId}) is already exist!`,
          );
        }

        const position = await this.positionRepository.findOne({
          where: { id: payload.positionId },
        });

        if (!position) {
          throw new NotFoundException(
            `Position with such id '${payload.positionId}' not found`,
          );
        }

        await this.softSkillMatrixRepository.update({ id }, { position });
      }

      const allPayloadSkillIds = payload.skills.map((skill) => skill.id);
      const allPrevMatrixSkillsIds = prevSavedMatrix.skills.map(
        (skill) => skill.id,
      );

      const deletedSkillsIds = prevSavedMatrix.skills
        .filter((item) => !allPayloadSkillIds.includes(item.id))
        .map((item) => item.id);
      const newSkills = payload.skills.filter(
        (item) => !allPrevMatrixSkillsIds.includes(item.id),
      );

      //delete groups
      if (deletedSkillsIds.length) {
        await this.softSkillRepository.query(
          `
                DELETE FROM public."soft_skill"
                    WHERE public."soft_skill".id = ANY($1)
          `,
          [deletedSkillsIds],
        );
      }

      //add new skills
      if (newSkills.length) {
        for (let skill of newSkills) {
          let createdSkill = await this.softSkillRepository.save({
            value: skill.value,
            softSkillMatrix: { id: prevSavedMatrix.id },
          });

          //add skill grades
          await this.softSkillsToLevelsRepository.save(
            skill.levels.map((level) => {
              return this.softSkillsToLevelsRepository.create({
                skill_id: { id: createdSkill.id },
                level_id: { id: level.level_id.id },
                value: level.value,
                description: level.description,
              });
            }),
          );
        }
      }

      const newAndDeletedSkillIds = [
        ...deletedSkillsIds,
        ...newSkills.map((skill) => skill.id),
      ];
      const skillsWithoutNewAndDeleted = prevSavedMatrix.skills.filter(
        (skill) => !newAndDeletedSkillIds.includes(skill.id),
      );

      //edit old skills
      if (skillsWithoutNewAndDeleted.length) {
        for (let oldSkill of skillsWithoutNewAndDeleted) {
          const skillFromPayload = payload.skills.filter(
            (item) => item.id === oldSkill.id,
          );
          const currentSkillLevelsIds = skillFromPayload[0].levels.map(
            (level) => level.id,
          );

          //edit skill name
          if (
            skillFromPayload.length &&
            skillFromPayload[0].value !== oldSkill.value
          ) {
            await this.softSkillRepository.update(
              { id: oldSkill.id },
              { value: skillFromPayload[0].value },
            );
          }

          const deletedSkillLevelsIds = oldSkill.levels
            .filter((level) => !currentSkillLevelsIds.includes(level.id))
            .map((item) => item.id);
          const newSkillLevels = skillFromPayload[0].levels.filter(
            (level) =>
              !oldSkill.levels.map((item) => item.id).includes(level.id),
          );

          //delete skill levels
          if (deletedSkillLevelsIds.length) {
            await this.softSkillsToLevelsRepository.query(
              `
                    DELETE FROM public.soft_skill_levels
                        WHERE public.soft_skill_levels.id = ANY($1)
              `,
              [deletedSkillLevelsIds],
            );
          }
          //added new skills levels
          if (newSkillLevels.length) {
            for (let newLevel of newSkillLevels) {
              await this.softSkillsToLevelsRepository.save({
                skill_id: { id: skillFromPayload[0].id },
                level_id: { id: newLevel.level_id.id },
                value: newLevel.value,
                description: newLevel.description,
              });
            }
          }

          const newAndDeletedSkillLevelssIds = [
            ...deletedSkillLevelsIds,
            ...newSkillLevels.map((level) => level.id),
          ];
          const skillLevelsWithoutNewAndDeletedSkillLevels =
            skillFromPayload[0].levels.filter(
              (item) => !newAndDeletedSkillLevelssIds.includes(item.id),
            );

          //update skills
          if (skillLevelsWithoutNewAndDeletedSkillLevels.length) {
            for (let oldLevel of skillLevelsWithoutNewAndDeletedSkillLevels) {
              const skillLevelsFromPayload = skillFromPayload[0].levels.filter(
                (item) => item.id === oldLevel.id,
              );
              const skillLevelsFromDB = oldSkill.levels.filter(
                (item) => item.id === skillLevelsFromPayload[0].id,
              );

              //update name
              if (
                skillLevelsFromPayload.length &&
                skillLevelsFromDB[0].value !== skillLevelsFromPayload[0].value
              ) {
                await this.softSkillsToLevelsRepository.update(
                  { id: skillLevelsFromPayload[0].id },
                  {
                    value: skillLevelsFromPayload[0].value,
                  },
                );
              }
              //update description
              if (
                skillLevelsFromPayload.length &&
                skillLevelsFromDB[0].description !==
                  skillLevelsFromPayload[0].description
              ) {
                await this.softSkillsToLevelsRepository.update(
                  { id: skillLevelsFromPayload[0].id },
                  {
                    description: skillLevelsFromPayload[0].description,
                  },
                );
              }
              //update carierLevel
              if (
                skillLevelsFromPayload.length &&
                skillLevelsFromDB[0].level_id.id !==
                  skillLevelsFromPayload[0].level_id.id
              ) {
                await this.softSkillsToLevelsRepository.update(
                  { id: skillLevelsFromPayload[0].id },
                  {
                    level_id: { id: skillLevelsFromPayload[0].level_id.id },
                  },
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[SOFT_SKILL_MATRIX_UPDATE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          {
            status: error?.status,
            message: error?.response?.message ?? error?.response,
          },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
