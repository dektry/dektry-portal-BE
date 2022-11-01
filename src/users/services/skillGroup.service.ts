import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skillGroupRepository } from '../repositories/skillGroup.repository';
import { skillRepository } from '../repositories/skill.repository';
import { questionRepository } from '../repositories/question.repository';
import { skillsToLevelsRepository } from '../repositories/skillsToLevels.repository';
import { SkillGroupEntity } from '../entity/skillGroup.entity';

import { sortSkillGroups } from '../utils/sortSkillGroups';

@Injectable()
export class SkillGroupService {
  constructor(
    @InjectRepository(skillGroupRepository)
    private skillGroupRepository: skillGroupRepository,
    @InjectRepository(questionRepository)
    private questionRepository: questionRepository,
    @InjectRepository(skillRepository)
    private skillRepository: skillRepository,
    @InjectRepository(skillsToLevelsRepository)
    private skillsToLevelsRepository: skillsToLevelsRepository,
  ) {}

  async getSkillGroups(): Promise<SkillGroupEntity[]> {
    return await this.skillGroupRepository.find({
      relations: ['skills'],
    });
  }

  async getSkillGroupsByPositionId(
    positionId: string,
  ): Promise<SkillGroupEntity[]> {
    let skillGroups = await this.skillGroupRepository
      .createQueryBuilder('sg')
      .where({ position_id: positionId })
      .select(['sg', 's', 'q', 'sl.value', 'l'])
      .leftJoin('sg.skills', 's')
      .leftJoin('s.questions', 'q')
      .leftJoin('s.levels', 'sl')
      .leftJoin('sl.level_id', 'l')
      .getMany();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO parse level_id and remove this code
    skillGroups = skillGroups.map((skillGroup) => ({
      ...skillGroup,
      uuid: skillGroup.id,
      skills: skillGroup.skills.map((skill) => ({
        ...skill,
        uuid: skill.id,
        levels: skill.levels.map((l) => ({
          uuid: l.id,
          ...l,
          ...l.level_id,
        })),
        questions: skill.questions.map((q) => ({
          uuid: q.id,
          ...q,
        })),
      })),
    }));

    return sortSkillGroups(skillGroups);
  }

  async getSkillGroupsByIds(
    positionId: string,
    levelId: string,
  ): Promise<SkillGroupEntity[]> {
    const unsortedSkillGroups = await this.skillGroupRepository
      .createQueryBuilder('sg')
      .where({ position_id: positionId })
      .andWhere('sl."level_id" = :id', { id: levelId })
      .select(['sg', 's', 'q', 'sl.value'])
      .leftJoin('sg.skills', 's')
      .leftJoin('s.questions', 'q')
      .leftJoin('s.levels', 'sl')
      .getMany();

    return sortSkillGroups(unsortedSkillGroups);
  }

  async updateSkillGroup({
    matrixTree,
    position_id,
  }: {
    matrixTree: SkillGroupEntity[];
    position_id: string;
  }): Promise<SkillGroupEntity[]> {
    for (const skillGroup of matrixTree) {
      for (const skill of skillGroup.skills) {
        await this.questionRepository.save(skill.questions);
      }
      const savedSkills = await this.skillRepository.save(skillGroup.skills);

      savedSkills.map((skill: any) => {
        this.skillsToLevelsRepository.save(
          skill.levels.map((level) => ({
            skill_id: skill.id,
            level_id: level.id,
            value: level.value,
          })),
        );
      });
    }

    const existedGroups = await this.skillGroupRepository.find({
      where: {
        position_id,
      },
    });

    if (existedGroups.length > matrixTree.length) {
      await this.skillGroupRepository.delete(
        existedGroups
          .filter(({ id }) => !matrixTree.find((group) => group.id === id))
          .map((item) => item.id),
      );
    }

    return await this.skillGroupRepository.save(matrixTree);
  }
}
