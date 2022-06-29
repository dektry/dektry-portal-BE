import { createConnection, Connection } from 'typeorm';
import { SkillGroupEntity } from '../src/users/entity/skillGroup.entity';
import { CareerLevelEntity } from '../src/users/entity/careerLevel.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { skillGroupSeed } from './seeds/skillGroup.seed';
import { difference } from 'lodash';

const importSkillGroups = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSkillGroups = await connection
    .getRepository(SkillGroupEntity)
    .find();
  const existPositions = await connection.getRepository(PositionEntity).find();
  const existCareerLevels = await connection
    .getRepository(CareerLevelEntity)
    .find();

  const newSkillGroups = skillGroupSeed.filter((newGroup) => {
    const isGroupExist = currentSkillGroups.some(
      (existGroup) => newGroup.value === existGroup.value,
    );
    return !isGroupExist;
  });

  const alreadyExistedNewGroups = difference(skillGroupSeed, newSkillGroups);

  alreadyExistedNewGroups.forEach((group) => {
    console.log(`Skill group ${group.value} already exists!`);
  });

  const newSkillGroupsWithPositions = newSkillGroups.map((newGroup) => {
    const formatPosition = newGroup.positions.map((position) => {
      const existPositionEntity = existPositions.find(
        (existPosition) => existPosition.name === position,
      );
      return existPositionEntity;
    });
    return {
      ...newGroup,
      position_id: formatPosition,
    };
  });
  console.log('POSITION FOR SKILL GROUP', newSkillGroupsWithPositions);
  const createdGroups = await connection.getRepository(SkillGroupEntity).save(
    newSkillGroupsWithPositions.map((group) => {
      return connection.getRepository(SkillGroupEntity).create(group);
    }),
  );

  console.log(`Added ${createdGroups.length} new skill group!`);
  await connection.close();
};

export default importSkillGroups;
