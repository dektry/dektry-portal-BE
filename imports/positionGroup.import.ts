import { createConnection, Connection } from 'typeorm';
import { PositionGroupEntity } from '../src/users/entity/positionGroup.entity';
import { positionGroupSeed } from './seeds/positionGroup.seed';
import { difference } from 'lodash';

const importPositionGroup = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentPositionGroups = await connection
    .getRepository(PositionGroupEntity)
    .find();

  const newPositionGroup = positionGroupSeed.filter((newPositionGroup) => {
    const isPositionGroupExist = currentPositionGroups.some(
      (positionGroup) => newPositionGroup.name === positionGroup.name,
    );
    return !isPositionGroupExist;
  });
  const alreadyExistedNewPermissions = difference(
    positionGroupSeed,
    newPositionGroup,
  );
  alreadyExistedNewPermissions.forEach((element) => {
    console.log(`Position group ${element.name} is already exist!`);
  });

  const createdPositionGroup = await connection
    .getRepository(PositionGroupEntity)
    .save(
      newPositionGroup.map((positionGroup) => {
        return connection
          .getRepository(PositionGroupEntity)
          .create(positionGroup);
      }),
    );
  console.log(`Added ${createdPositionGroup.length} new positions groups!`);
  await connection.close();
};

export default importPositionGroup;
