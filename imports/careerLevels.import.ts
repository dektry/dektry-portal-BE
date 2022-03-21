import { createConnection, Connection } from 'typeorm';
import { CareerLevelEntity } from '../src/users/entity/careerLevel.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { careerLevelsSeed } from './seeds/careerLevels.seed';
import { difference } from 'lodash';

const importCareerLevels = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentLevels = await connection
    .getRepository(CareerLevelEntity)
    .find();
  const existPositions = await connection.getRepository(PositionEntity).find();
  console.log(existPositions);
  const newCareerLevels = careerLevelsSeed.filter((newLevel) => {
    const isLevelExist = currentLevels.some(
      (existLevel) => newLevel.name === existLevel.name,
    );
    return !isLevelExist;
  });

  const alreadyExistedNewLevels = difference(careerLevelsSeed, newCareerLevels);

  alreadyExistedNewLevels.forEach((level) => {
    console.log(`Level ${level.name} is already exist!`);
  });

  const newCareerLevelsWithPosition = newCareerLevels.map((newLevel) => {
    const formatPosition = newLevel.positions.map((position) => {
      const existPositionEntity = existPositions.find(
        (existPosition) => existPosition.name === position,
      );
      return existPositionEntity;
    });

    return {
      ...newLevel,
      positions: formatPosition,
    };
  });
  const createdLevels = await connection.getRepository(CareerLevelEntity).save(
    newCareerLevelsWithPosition.map((level) => {
      return connection.getRepository(CareerLevelEntity).create(level);
    }),
  );

  console.log(`Added ${createdLevels.length} new level!`);
  await connection.close();
};

export default importCareerLevels;
