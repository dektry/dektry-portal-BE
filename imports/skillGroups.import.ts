import { createConnection, Connection } from 'typeorm';
import { SkillGroupEntity } from '../src/users/entity/skillGroup.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { skillGroupSeed } from './seeds/skillGroup.seed';
import { difference, flatten } from 'lodash';

const importSkillGroups = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentSkillGroups = await connection
    .getRepository(SkillGroupEntity)
    .find();
  const existPositions = await connection.getRepository(PositionEntity).find();
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
  const newSkillGroupsWithPositions = []; 
  newSkillGroups.forEach((newGroup) => {
    newGroup.positions.forEach((position) => {
      const existPositionEntity = existPositions.find(
        (existPosition) => existPosition.name === position,
      );
      newSkillGroupsWithPositions.push({
        value: newGroup.value,
        position_id: existPositionEntity,
      });
    });
  });

  const flattenArray = flatten(newSkillGroupsWithPositions);

  const mapped = flattenArray.map((group) => {
    return connection.getRepository(SkillGroupEntity).create(group);
  });

  const createdGroups = await connection
    .getRepository(SkillGroupEntity)
    .save(mapped);

  console.log(`Added ${createdGroups.length} new skill group!`);
  await connection.close();
};

export default importSkillGroups;
