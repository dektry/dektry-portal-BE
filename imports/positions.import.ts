import { createConnection, Connection } from 'typeorm';
import { PositionEntity } from '../src/users/entity/position.entity';
import { positionSeed } from './seeds/position.seed';
import { difference } from 'lodash';

const importPositions = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentPositions = await connection
    .getRepository(PositionEntity)
    .find();

  const newPositions = positionSeed.filter((newPosition) => {
    const isPositionExist = currentPositions.some(
      (existPosition) => newPosition.name === existPosition.name,
    );
    return !isPositionExist;
  });
  const alreadyExistedNewPositions = difference(positionSeed, newPositions);
  alreadyExistedNewPositions.forEach((element) => {
    console.log(`Position ${element.name} is already exist!`);
  });

  const newPositionsWithRelations = newPositions.map((position) => {
    return { ...position };
  });

  const createdPositions = await connection.getRepository(PositionEntity).save(
    newPositionsWithRelations.map((position) => {
      return connection.getRepository(PositionEntity).create(position);
    }),
  );
  console.log(`Added ${createdPositions.length} new positions!`);
  await connection.close();
};

export default importPositions;
