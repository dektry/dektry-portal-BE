import { createConnection, Connection } from 'typeorm';
import { SkillGroupEntity } from '../src/users/entity/skillGroup.entity';
import { SkillEntity } from '../src/users/entity/skill.entity';
import { skillsSeed } from './seeds/skills.seed';
import { difference, flatten } from 'lodash';

const importSkills = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSkills = await connection.getRepository(SkillEntity).find();
  const existSkillGroups = await connection
    .getRepository(SkillGroupEntity)
    .find();

  const newSkills = skillsSeed.filter((newSkill) => {
    let isSkillExist = false;

    for (const existSkill of currentSkills) {
      const existSkillGroupValue = existSkillGroups.find(
        (group) => group.id === existSkill.skill_group_id.id,
      ).value;
      if (
        newSkill.value === existSkill.value &&
        newSkill.skillGroup === existSkillGroupValue
      ) {
        isSkillExist = true;
      }
    }
    return !isSkillExist;
  });

  const alreadyExistedNewSkills = difference(skillsSeed, newSkills);

  alreadyExistedNewSkills.forEach((skill) => {
    console.log(`Skill ${skill.value} already exists!`);
  });

  const newSkillsWithSkillGroup = [];
  newSkills.forEach((newSkill) => {
    const formatSkillGroup = existSkillGroups.filter(
      (existSkillGroup) => existSkillGroup.value === newSkill.skillGroup,
    );

    formatSkillGroup.forEach((group) =>
      newSkillsWithSkillGroup.push({
        value: newSkill.value,
        skill_group_id: group,
      }),
    );
  });

  const flattenSkills = flatten(newSkillsWithSkillGroup);

  const createdSkills = await connection.getRepository(SkillEntity).save(
    flattenSkills.map((skill) => {
      return connection.getRepository(SkillEntity).create(skill);
    }),
  );

  console.log(`Added ${createdSkills.length} new skill!`);
  await connection.close();
};

export default importSkills;
