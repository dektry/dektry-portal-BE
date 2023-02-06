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

import { englishSkillMatrixRepository } from '../repositories/englishSkillMatrix.repository';
import { positionRepository } from '../repositories/position.repository';
import { englishSkillGroupRepository } from '../repositories/englishSkillGroup.repository';
import { englishSkillRepository } from '../repositories/englishSkill.repository';
import { englishQuestionRepository } from '../repositories/englishQuestion.repository';
import { englishSkillsToLevelsRepository } from '../repositories/englishSkillsToLevels.repository';

import {
  EnglishSkillMatrixCreateDto,
  EnglishSkillMatrixGetDto,
  EnglishSkillMatrixGetDetailsDto,
  EnglishSkillMatrixUpdateDto,
  EnglishSkillMatrixCopyDto,
  EnglishSkillMatrixCopyResponseDto,
} from '../dto/englishSkillMatrix.dto';

@Injectable()
export class EnglishSkillMatrixService {
  constructor(
    @InjectRepository(englishSkillMatrixRepository)
    private englishSkillMatrixRepository: englishSkillMatrixRepository,
    @InjectRepository(positionRepository)
    private positionRepository: positionRepository,
    @InjectRepository(englishSkillGroupRepository)
    private englishSkillGroupRepository: englishSkillGroupRepository,
    @InjectRepository(englishQuestionRepository)
    private englishQuestionRepository: englishQuestionRepository,
    @InjectRepository(englishSkillRepository)
    private englishSkillRepository: englishSkillRepository,
    @InjectRepository(englishSkillsToLevelsRepository)
    private englishSkillsToLevelsRepository: englishSkillsToLevelsRepository,
  ) {}

  async create(payload: EnglishSkillMatrixCreateDto) {
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
        await this.englishSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.englishSkillMatrixRepository.save({ position });

      for (const skillGroup of payload.skillGroups) {
        const createdSkillGroup = await this.englishSkillGroupRepository.save({
          value: skillGroup.value,
          order: skillGroup.order,
          englishSkillMatrix: matrix,
        });
        for (const skill of skillGroup.english_skills) {
          const createdSkill = await this.englishSkillRepository.save({
            value: skill.value,
            order: skill.order,
            english_skill_group_id: createdSkillGroup,
          });

          //add skill grades
          await this.englishSkillsToLevelsRepository.save(
            skill.grades.map((grade) => {
              return this.englishSkillsToLevelsRepository.create({
                english_skill_id: { id: createdSkill.id },
                level_id: { id: grade.levelId },
                value: grade.value,
              });
            }),
          );

          for (const question of skill.questions) {
            await this.englishQuestionRepository.save({
              value: question.value,
              order: question.order,
              english_skill_id: createdSkill,
            });
          }
        }
      }
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_CREATION_ERROR]', error);
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

  async getAll(): Promise<EnglishSkillMatrixGetDto[]> {
    try {
      return await this.englishSkillMatrixRepository.find({
        relations: ['position'],
      });
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_GET_ALL_ERROR]', error);
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

  async getDetails(id: string): Promise<EnglishSkillMatrixGetDetailsDto> {
    try {
      const matrix = await this.englishSkillMatrixRepository.findOne({
        where: { id },
        relations: [
          'position',
          'englishSkillGroups',
          'englishSkillGroups.english_skills',
          'englishSkillGroups.english_skills.levels',
          'englishSkillGroups.english_skills.levels.level_id',
          'englishSkillGroups.english_skills.questions',
        ],
      });

      if (!matrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      return matrix;
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_GET_DETAILS_ERROR]', error);
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

  async deleteEnglishSkillMatrix(id: string): Promise<DeleteResult> {
    try {
      const result = await this.englishSkillMatrixRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Position with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_DELETE_ERROR]', error);
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
    payload: EnglishSkillMatrixCopyDto,
  ): Promise<EnglishSkillMatrixCopyResponseDto> {
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
        await this.englishSkillMatrixRepository.findOne({
          where: {
            position,
          },
        });

      if (isMatrixWithSuchPositionExist) {
        throw new ConflictException(
          `Matrix with such position(${position.name}) is already exist!`,
        );
      }

      const matrix = await this.englishSkillMatrixRepository.save({ position });
      const copiedMatrix: EnglishSkillMatrixGetDetailsDto =
        await this.getDetails(payload.englishSkillMatrixId);

      for (const skillGroup of copiedMatrix?.englishSkillGroups) {
        const createdSkillGroup = await this.englishSkillGroupRepository.save({
          value: skillGroup.value,
          order: skillGroup.order,
          englishSkillMatrix: matrix,
        });
        for (const skill of skillGroup.english_skills) {
          const createdSkill = await this.englishSkillRepository.save({
            value: skill.value,
            order: skill.order,
            english_skill_group_id: createdSkillGroup,
          });

          //add skill grades
          await this.englishSkillsToLevelsRepository.save(
            skill.levels.map((grade) => {
              return this.englishSkillsToLevelsRepository.create({
                english_skill_id: { id: createdSkill.id },
                level_id: { id: grade.level_id.id },
                value: grade.value,
              });
            }),
          );

          for (const question of skill.questions) {
            await this.englishQuestionRepository.save({
              value: question.value,
              order: question.order,
              english_skill_id: createdSkill,
            });
          }
        }
      }

      return { englishSkillMatrixId: matrix.id };
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_COPY_ERROR]', error);
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

  async update(payload: EnglishSkillMatrixUpdateDto, id: string) {
    try {
      const prevSavedMatrix: EnglishSkillMatrixGetDetailsDto =
        await this.getDetails(id);

      if (!prevSavedMatrix) {
        throw new NotFoundException(`Matrix with such id '${id}' not found`);
      }

      //update position
      if (prevSavedMatrix.position.id !== payload.positionId) {
        const isMatrixWithSuchPositionExist =
          await this.englishSkillMatrixRepository.findOne({
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

        await this.englishSkillMatrixRepository.update({ id }, { position });
      }

      const allPayloadGroupIds = payload.englishSkillGroups.map(
        (group) => group.id,
      );
      const allPrevMatrixGroupIds = prevSavedMatrix.englishSkillGroups.map(
        (group) => group.id,
      );

      const deletedSkillGroupsIds = prevSavedMatrix.englishSkillGroups
        .filter((item) => !allPayloadGroupIds.includes(item.id))
        .map((item) => item.id);
      const newSkillGroups = payload.englishSkillGroups.filter(
        (item) => !allPrevMatrixGroupIds.includes(item.id),
      );

      //delete groups
      if (deletedSkillGroupsIds.length) {
        await this.englishSkillGroupRepository.query(
          `
                DELETE FROM public."englishSkillGroup"
                    WHERE public."englishSkillGroup".id = ANY($1)
          `,
          [deletedSkillGroupsIds],
        );
      }

      //add new groups
      if (newSkillGroups.length) {
        for (const newGroup of newSkillGroups) {
          const createdSkillGroup = await this.englishSkillGroupRepository.save(
            {
              value: newGroup.value,
              order: newGroup.order,
              englishSkillMatrix: { id: prevSavedMatrix.id },
            },
          );

          for (const skill of newGroup.english_skills) {
            const createdSkill = await this.englishSkillRepository.save({
              value: skill.value,
              order: skill.order,
              english_skill_group_id: { id: createdSkillGroup.id },
            });

            //add skill grades
            await this.englishSkillsToLevelsRepository.save(
              skill.levels.map((grade) => {
                return this.englishSkillsToLevelsRepository.create({
                  english_skill_id: { id: createdSkill.id },
                  level_id: { id: grade.level_id.id },
                  value: grade.value,
                });
              }),
            );

            for (const question of skill.questions) {
              await this.englishQuestionRepository.save({
                value: question.value,
                order: question.order,
                english_skill_id: { id: createdSkill.id },
              });
            }
          }
        }
      }

      const newAndDeletedGroupIds = [
        ...deletedSkillGroupsIds,
        ...newSkillGroups.map((group) => group.id),
      ];
      const groupsWithoutNewAndDeleted =
        prevSavedMatrix.englishSkillGroups.filter(
          (group) => !newAndDeletedGroupIds.includes(group.id),
        );

      //edit old groups
      if (groupsWithoutNewAndDeleted.length) {
        for (const oldGroup of groupsWithoutNewAndDeleted) {
          const groupFromPayload = payload.englishSkillGroups.filter(
            (item) => item.id === oldGroup.id,
          );
          const currentGroupSkillsIds = groupFromPayload[0].english_skills.map(
            (skill) => skill.id,
          );

          //edit group name
          if (
            groupFromPayload.length &&
            (groupFromPayload[0].value !== oldGroup.value ||
              groupFromPayload[0].order !== oldGroup.order)
          ) {
            await this.englishSkillGroupRepository.update(
              { id: oldGroup.id },
              {
                value: groupFromPayload[0].value,
                order: groupFromPayload[0].order,
              },
            );
          }

          const deletedSkillIds = oldGroup.english_skills
            .filter((skill) => !currentGroupSkillsIds.includes(skill.id))
            .map((item) => item.id);
          const newSkills = groupFromPayload[0].english_skills.filter(
            (skill) =>
              !oldGroup.english_skills
                .map((item) => item.id)
                .includes(skill.id),
          );

          //delete skill
          if (deletedSkillIds.length) {
            await this.englishSkillRepository.query(
              `
                    DELETE FROM public.skill
                        WHERE public.skill.id = ANY($1)
              `,
              [deletedSkillIds],
            );
          }
          //added new skills
          if (newSkills.length) {
            for (const newSkill of newSkills) {
              const createdNewSkill = await this.englishSkillRepository.save({
                value: newSkill.value,
                order: newSkill.order,
                english_skill_group_id: { id: groupFromPayload[0].id },
              });

              //add skill grades
              await this.englishSkillsToLevelsRepository.save(
                newSkill.levels.map((grade) => {
                  return this.englishSkillsToLevelsRepository.create({
                    english_skill_id: { id: createdNewSkill.id },
                    level_id: { id: grade.level_id.id },
                    value: grade.value,
                  });
                }),
              );

              for (const question of newSkill.questions) {
                await this.englishQuestionRepository.save({
                  value: question.value,
                  order: question.order,
                  english_skill_id: { id: createdNewSkill.id },
                });
              }
            }
          }

          const newAndDeletedSkillsIds = [
            ...deletedSkillIds,
            ...newSkills.map((skill) => skill.id),
          ];
          const skillsWithoutNewAndDeletedSkills =
            groupFromPayload[0].english_skills.filter(
              (item) => !newAndDeletedSkillsIds.includes(item.id),
            );

          //update skills
          if (skillsWithoutNewAndDeletedSkills.length) {
            for (const oldSkill of skillsWithoutNewAndDeletedSkills) {
              const skillFromPayload =
                groupFromPayload[0].english_skills.filter(
                  (item) => item.id === oldSkill.id,
                );
              const skillFromDB = oldGroup.english_skills.filter(
                (item) => item.id === skillFromPayload[0].id,
              );
              const currentQuestionsIds = skillFromPayload[0].questions.map(
                (item) => item.id,
              );

              if (
                skillFromPayload.length &&
                (skillFromDB[0].value !== skillFromPayload[0].value ||
                  skillFromDB[0].order !== skillFromPayload[0].order)
              ) {
                await this.englishSkillRepository.update(
                  { id: skillFromPayload[0].id },
                  {
                    value: skillFromPayload[0].value,
                    order: skillFromPayload[0].order,
                  },
                );
              }

              //update skill grade
              if (skillFromPayload.length) {
                for (const grade of skillFromPayload[0].levels) {
                  const gradeFromDb = skillFromDB[0].levels.filter(
                    (item) => item.id === grade.id,
                  );

                  if (
                    gradeFromDb.length &&
                    gradeFromDb[0].value !== grade.value
                  ) {
                    await this.englishSkillsToLevelsRepository.update(
                      { id: grade.id },
                      { value: grade.value },
                    );
                  }
                }
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
                await this.englishQuestionRepository.query(
                  `
                    DELETE FROM public.question
                        WHERE public.question.id = ANY($1)
              `,
                  [deletedQuestionIds],
                );
              }

              //add new question
              if (newQuestions.length) {
                for (const newQuestion of newQuestions)
                  await this.englishQuestionRepository.save({
                    value: newQuestion.value,
                    order: newQuestion.order,
                    english_skill_id: { id: skillFromPayload[0].id },
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
                for (const oldQuestion of questionsWithoutNewAndDeletedQuestions) {
                  const questionFromDb = skillFromDB[0].questions.filter(
                    (item) => item.id === oldQuestion.id,
                  );

                  if (
                    questionFromDb.length &&
                    (questionFromDb[0].value !== oldQuestion.value ||
                      questionFromDb[0].order !== oldQuestion.order)
                  ) {
                    await this.englishQuestionRepository.update(
                      { id: oldQuestion.id },
                      {
                        value: oldQuestion.value,
                        order: oldQuestion.order,
                      },
                    );
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('[ENGLISH_SKILL_MATRIX_UPDATE_ERROR]', error);
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
