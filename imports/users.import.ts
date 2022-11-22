import { createConnection, Connection } from 'typeorm';
import { UserEntity } from '../src/users/entity/user.entity';
import { userSeed } from './seeds/user.seed';
import { difference } from 'lodash';

const importUsers = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistUsers = await connection.getRepository(UserEntity).find();

  const newUsers = userSeed.filter((newUser) => {
    const isUserExist = allExistUsers.some(
      (existUser) => newUser.email === existUser.email,
    );
    return !isUserExist;
  });

  const alreadyExistedNewUsers = difference(userSeed, newUsers);
  alreadyExistedNewUsers.forEach((element) => {
    console.log(`Users '${element.email}' is already exist!`);
  });

  const createdUsers = await connection.getRepository(UserEntity).save(
    newUsers.map((user) => {
      return connection.getRepository(UserEntity).create(user);
    }),
  );
  console.log(`Added ${createdUsers.length} new users!`);
  await connection.close();
};

export default importUsers;
