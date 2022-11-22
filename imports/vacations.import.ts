import { createConnection, Connection } from 'typeorm';
import { difference } from 'lodash';
import { UserEntity } from '../src/users/entity/user.entity';
import { VacationsEntity } from '../src/vacations/entity/vacations.entity';
import { vacationsSeed } from './seeds/vacations.seed';

const importVacations = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentVacations = await connection
    .getRepository(VacationsEntity)
    .find();
  const existUsers = await connection.getRepository(UserEntity).find();

  const newVacations = vacationsSeed.filter((newVacation) => {
    const isVacationExist = currentVacations.some(
      (existVacation) => newVacation.id === existVacation.id,
    );
    return !isVacationExist;
  });

  const alreadyExistedNewVacations = difference(vacationsSeed, newVacations);

  alreadyExistedNewVacations.forEach((vacation) => {
    console.log(`Vacation ${vacation.id} is already exist!`);
  });

  const newVacationWithUser = newVacations.map((newVacation) => {
    const formatUser = existUsers.find(
      (existUser) =>
        `${existUser.firstName} ${existUser.lastName}` === newVacation.user,
    );

    return {
      ...newVacation,
      user: formatUser,
    };
  });

  const createdVacations = await connection.getRepository(VacationsEntity).save(
    newVacationWithUser.map((vacation) => {
      return connection.getRepository(VacationsEntity).create(vacation);
    }),
  );

  console.log(`Added ${createdVacations.length} new vacations!`);
  await connection.close();
};

export default importVacations;
