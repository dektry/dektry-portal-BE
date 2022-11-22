import { createConnection, Connection } from 'typeorm';
import { CareerEntity } from '../src/users/entity/career.entity';
import { UserEntity } from '../src/users/entity/user.entity';
import { PositionEntity } from '../src/users/entity/position.entity';
import { careerSeed } from './seeds/career.seed';

const importCareers = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistUsers = await connection.getRepository(UserEntity).find();
  const allExistPositions = await connection
    .getRepository(PositionEntity)
    .find();

  const newCareersWithRelations = careerSeed.map((career) => {
    const userEntity = allExistUsers.find((existUser) => {
      return career.user === existUser.email;
    });
    const positionEntity = allExistPositions.find((existPosition) => {
      return career.position === existPosition.name;
    });
    return { ...career, user: userEntity, position: positionEntity };
  });

  const createdCareers = await connection.getRepository(CareerEntity).save(
    newCareersWithRelations.map((career) => {
      return connection.getRepository(CareerEntity).create(career);
    }),
  );

  console.log(`Added ${createdCareers.length} new careers!`);
  await connection.close();
};

export default importCareers;
