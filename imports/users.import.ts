import { createConnection, Connection } from 'typeorm';
import { UserEntity } from '../src/users/entity/user.entity';
import { RoleEntity } from '../src/users/entity/role.entity';
import { userSeed } from './seeds/user.seed';
import { difference } from 'lodash';

const importUsers = async () => {
  const connection: Connection = await createConnection('data-import');
  const allExistUsers = await connection.getRepository(UserEntity).find();
  const existRoles = await connection.getRepository(RoleEntity).find();

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

  const newUsersWithRelations = newUsers.map((user) => {
    const newRole = existRoles.find((existRole) => {
      return existRole.name === user.role;
    });
    return { ...user, role: newRole };
  });

  newUsersWithRelations.forEach((user) => {
    if (!user.role) {
      throw new Error(`Role '${user.role}' of '${user.email}' is not exist!`);
    }
  });

  const createdRoles = await connection.getRepository(UserEntity).save(
    newUsersWithRelations.map((user) => {
      return connection.getRepository(UserEntity).create(user);
    }),
  );
  console.log(`Added ${createdRoles.length} new users!`);
  await connection.close();
};

export default importUsers;
