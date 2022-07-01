import { createConnection, Connection } from 'typeorm';
import { SkillsToLevelsEntity } from '../src/users/entity/skillsToLevels.entity';
import { SkillEntity } from '../src/users/entity/skill.entity';
import { CareerLevelEntity } from '../src/users/entity/careerLevel.entity';
import { skillLevelsSeed } from './seeds/skillLevels.seed';
import { difference, flatten } from 'lodash';

const importSkillLevels = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSkillLevels = await connection
    .getRepository(SkillsToLevelsEntity)
    .find();
  const existSkills = await connection.getRepository(SkillEntity).find();
  const existCarrerLevels = await connection
    .getRepository(CareerLevelEntity)
    .find();
  const newSkillLevels = skillLevelsSeed.filter((newLevel) => {
    const isLevelExist = currentSkillLevels.some(
      (existLevel) => newLevel.value === existLevel.value,
    );
    return !isLevelExist;
  });

  const alreadyExistedNewLevels = difference(skillLevelsSeed, newSkillLevels);

  alreadyExistedNewLevels.forEach((level) => {
    console.log(`Skill level ${level.value} already exists!`);
  });

  const newSkillLevelsWithSkillGroupAndCareerLevels = [];
  skillLevelsSeed.forEach((newLevel) => {
    const existPositionEntity = existCarrerLevels.find(
      (existPosition) => existPosition.name === newLevel.level,
    );

    const existSkillEntity = existSkills.filter(
      (existSkill) => existSkill.value === newLevel.skill,
    );

    existSkillEntity.forEach((skill) =>
      newSkillLevelsWithSkillGroupAndCareerLevels.push({
        value: newLevel.value,
        skill_id: skill,
        level_id: existPositionEntity,
      }),
    );
  });

  const flattenSkillLevels = flatten(
    newSkillLevelsWithSkillGroupAndCareerLevels,
  );

  const createdLevels = await connection
    .getRepository(SkillsToLevelsEntity)
    .save(
      flattenSkillLevels.map((level) => {
        return connection.getRepository(SkillsToLevelsEntity).create(level);
      }),
    );

  console.log(`Added ${createdLevels.length} new skill level!`);
  await connection.close();
};

export default importSkillLevels;
