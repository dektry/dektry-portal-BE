import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';

import { hardSkillMatrixRepository } from '../repositories/hardSkillMatrix.repository';
import { positionRepository } from '../repositories/position.repository';
import { skillGroupRepository } from '../repositories/skillGroup.repository';
import { skillRepository } from '../repositories/skill.repository';
import { questionRepository } from '../repositories/question.repository';
import { skillsToLevelsRepository } from '../repositories/skillsToLevels.repository';

import { SkillGroupEntity } from '../entity/skillGroup.entity';

import {
  HardSkillMatrixCreateDto,
  HardSkillMatrixGetDto,
  HardSkillMatrixGetDetailsDto,
  HardSkillMatrixUpdateDto,
  HardSkillMatrixCopyDto,
  HardSkillMatrixCopyResponseDto,
} from '../dto/hardSkillMatrix.dto';

@Injectable()
export class HardSkillMatrixService {
  constructor(
    @InjectRepository(hardSkillMatrixRepository)
    private hardSkillMatrixRepository: hardSkillMatrixRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(skillGroupRepository)
    private skillGroupRepository: skillGroupRepository,
    @InjectRepository(questionRepository)
    private questionRepository: questionRepository,
    @InjectRepository(skillRepository)
    private skillRepository: skillRepository,
    @InjectRepository(skillsToLevelsRepository)
    private skillsToLevelsRepository: skillsToLevelsRepository,
  ) {}

  async create(payload: HardSkillMatrixCreateDto) {
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
        await this.hardSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.hardSkillMatrixRepository.save({ position });

      for (let skillGroup of payload.skillGroups) {
        let createdSkillGroup = await this.skillGroupRepository.save({
          value: skillGroup.value,
          hardSkillMatrix: matrix,
        });
        for (let skill of skillGroup.skills) {
          let createdSkill = await this.skillRepository.save({
            value: skill.value,
            skill_group_id: createdSkillGroup,
          });

          //add skill grades
          await this.skillsToLevelsRepository.save(
            skill.grades.map((grade) => {
              return this.skillsToLevelsRepository.create({
                skill_id: { id: createdSkill.id },
                level_id: { id: grade.levelId },
                value: grade.value,
              });
            }),
          );

          for (let question of skill.questions) {
            await this.questionRepository.save({
              value: question.value,
              skill_id: createdSkill,
            });
          }
        }
      }
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_CREATION_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(payload: HardSkillMatrixUpdateDto, id: string) {
    try {
      const prevSavedMatrix = await this.hardSkillMatrixRepository.findOne({
        where: { id },
        relations: [
          'position',
          'skillGroups',
          'skillGroups.skills',
          'skillGroups.skills.questions',
        ],
      });

      if (!prevSavedMatrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      //update position
      if (prevSavedMatrix.position.id !== payload.positionId) {
        const isMatrixWithSuchPositionExist =
          await this.hardSkillMatrixRepository.findOne({
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

        await this.hardSkillMatrixRepository.update({ id }, { position });
      }

      const allPayloadGroupIds = payload.skillGroups.map((group) => group.id);
      const allPrevMatrixGroupIds = prevSavedMatrix.skillGroups.map(
        (group) => group.id,
      );

      const deletedSkillGroupsIds = prevSavedMatrix.skillGroups
        .filter((item) => !allPayloadGroupIds.includes(item.id))
        .map((item) => item.id);
      const newSkillGroups = payload.skillGroups.filter(
        (item) => !allPrevMatrixGroupIds.includes(item.id),
      );

      //delete groups
      if (deletedSkillGroupsIds.length) {
        await this.skillGroupRepository.query(
          `
                DELETE FROM public."skillGroup"
                    WHERE public."skillGroup".id = ANY($1)
          `,
          [deletedSkillGroupsIds],
        );
      }

      //add new groups
      if (newSkillGroups.length) {
        for (let newGroup of newSkillGroups) {
          let createdSkillGroup = await this.skillGroupRepository.save({
            value: newGroup.value,
            hardSkillMatrix: { id: prevSavedMatrix.id },
          });

          for (let skill of newGroup.skills) {
            let createdSkill = await this.skillRepository.save({
              value: skill.value,
              skill_group_id: { id: createdSkillGroup.id },
            });

            for (let question of skill.questions) {
              await this.questionRepository.save({
                value: question.value,
                skill_id: { id: createdSkill.id },
              });
            }
          }
        }
      }

      const newAndDeletedGroupIds = [
        ...deletedSkillGroupsIds,
        ...newSkillGroups.map((group) => group.id),
      ];
      const groupsWithoutNewAndDeleted = prevSavedMatrix.skillGroups.filter(
        (group) => !newAndDeletedGroupIds.includes(group.id),
      );

      //edit old groups
      if (groupsWithoutNewAndDeleted.length) {
        for (let oldGroup of groupsWithoutNewAndDeleted) {
          const groupFromPayload = payload.skillGroups.filter(
            (item) => item.id === oldGroup.id,
          );
          const currentGroupSkillsIds = groupFromPayload[0].skills.map(
            (skill) => skill.id,
          );

          //edit group name
          if (
            groupFromPayload.length &&
            groupFromPayload[0].value !== oldGroup.value
          ) {
            await this.skillGroupRepository.update(
              { id: oldGroup.id },
              { value: groupFromPayload[0].value },
            );
          }

          const deletedSkillIds = oldGroup.skills
            .filter((skill) => !currentGroupSkillsIds.includes(skill.id))
            .map((item) => item.id);
          const newSkills = groupFromPayload[0].skills.filter(
            (skill) =>
              !oldGroup.skills.map((item) => item.id).includes(skill.id),
          );

          //delete skill
          if (deletedSkillIds.length) {
            await this.skillRepository.query(
              `
                    DELETE FROM public.skill
                        WHERE public.skill.id = ANY($1)
              `,
              [deletedSkillIds],
            );
          }
          //added new skills
          if (newSkills.length) {
            for (let newSkill of newSkills) {
              let createdNewSkill = await this.skillRepository.save({
                value: newSkill.value,
                skill_group_id: { id: groupFromPayload[0].id },
              });

              for (let question of newSkill.questions) {
                await this.questionRepository.save({
                  value: question.value,
                  skill_id: { id: createdNewSkill.id },
                });
              }
            }
          }

          const newAndDeletedSkillsIds = [
            ...deletedSkillIds,
            ...newSkills.map((skill) => skill.id),
          ];
          const skillsWithoutNewAndDeletedSkills =
            groupFromPayload[0].skills.filter(
              (item) => !newAndDeletedSkillsIds.includes(item.id),
            );

          //update skills
          if (skillsWithoutNewAndDeletedSkills.length) {
            for (let oldSkill of skillsWithoutNewAndDeletedSkills) {
              const skillFromPayload = groupFromPayload[0].skills.filter(
                (item) => item.id === oldSkill.id,
              );
              const skillFromDB = oldGroup.skills.filter(
                (item) => item.id === skillFromPayload[0].id,
              );
              const currentQuestionsIds = skillFromPayload[0].questions.map(
                (item) => item.id,
              );

              if (
                skillFromPayload.length &&
                skillFromDB[0].value !== skillFromPayload[0].value
              ) {
                await this.skillRepository.update(
                  { id: skillFromPayload[0].id },
                  { value: skillFromPayload[0].value },
                );
              }

              const deletedQuestionIds = skillFromDB[0].questions
                .filter((que) => !currentQuestionsIds.includes(que.id))
                .map((item) => item.id);
              const newQuestions = skillFromPayload[0].questions.filter(
                (que) =>
                  !skillFromDB[0]?.questions
                    .map((item) => item.id)
                    .includes(que.id),
              );

              //delete question
              if (deletedQuestionIds.length) {
                await this.questionRepository.query(
                  `
                    DELETE FROM public.question
                        WHERE public.question.id = ANY($1)
              `,
                  [deletedQuestionIds],
                );
              }

              //add new question
              if (newQuestions.length) {
                for (let newQuestion of newQuestions)
                  await this.questionRepository.save({
                    value: newQuestion.value,
                    skill_id: { id: skillFromPayload[0].id },
                  });
              }

              const newAndDeletedQuestionsIds = [
                ...deletedQuestionIds,
                ...newQuestions.map((que) => que.id),
              ];
              const questionsWithoutNewAndDeletedQuestions =
                skillFromPayload[0].questions.filter(
                  (item) => !newAndDeletedQuestionsIds.includes(item.id),
                );

              //edit questions
              if (questionsWithoutNewAndDeletedQuestions.length) {
                for (let oldQuestion of questionsWithoutNewAndDeletedQuestions) {
                  const questionFromDb = skillFromDB[0].questions.filter(
                    (item) => item.id === oldQuestion.id,
                  );

                  if (
                    questionFromDb.length &&
                    questionFromDb[0].value !== oldQuestion.value
                  ) {
                    await this.questionRepository.update(
                      { id: oldQuestion.id },
                      { value: oldQuestion.value },
                    );
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_UPDATE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<HardSkillMatrixGetDto[]> {
    try {
      return await this.hardSkillMatrixRepository.find({
        relations: ['position'],
      });
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_GET_ALL_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDetails(id: string): Promise<HardSkillMatrixGetDetailsDto> {
    try {
      const matrix = await this.hardSkillMatrixRepository.findOne({
        where: { id },
        relations: [
          'position',
          'skillGroups',
          'skillGroups.skills',
          'skillGroups.skills.levels',
          'skillGroups.skills.levels.level_id',
          'skillGroups.skills.questions',
        ],
      });

      if (!matrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      return matrix;
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_GET_DETAILS_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteHardSkillMatrix(id: string): Promise<DeleteResult> {
    try {
      const result = await this.hardSkillMatrixRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Position with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_DELETE_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async copy(
    payload: HardSkillMatrixCopyDto,
  ): Promise<HardSkillMatrixCopyResponseDto> {
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
        await this.hardSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.hardSkillMatrixRepository.save({ position });
      const copiedMatrix: HardSkillMatrixGetDetailsDto = await this.getDetails(
        payload.hardSkillMatrixId,
      );

      for (let skillGroup of copiedMatrix?.skillGroups) {
        let createdSkillGroup = await this.skillGroupRepository.save({
          value: skillGroup.value,
          hardSkillMatrix: matrix,
        });
        for (let skill of skillGroup.skills) {
          let createdSkill = await this.skillRepository.save({
            value: skill.value,
            skill_group_id: createdSkillGroup,
          });

          //add skill grades
          await this.skillsToLevelsRepository.save(
            skill.levels.map((grade) => {
              return this.skillsToLevelsRepository.create({
                skill_id: { id: createdSkill.id },
                level_id: { id: grade.level_id.id },
                value: grade.value,
              });
            }),
          );

          for (let question of skill.questions) {
            await this.questionRepository.save({
              value: question.value,
              skill_id: createdSkill,
            });
          }
        }
      }

      return { hardSkillMatrixId: matrix.id };
    } catch (error) {
      console.error('[HARD_SKILL_MATRIX_COPY_ERROR]', error);
      Logger.error(error);

      if (error?.response) {
        throw new HttpException(
          { status: error?.status, message: error?.response?.message },
          error?.status,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
