import { createConnection, Connection } from 'typeorm';
import { UserEntity } from '../src/users/entity/user.entity';
import { RoleEntity } from '../src/users/entity/role.entity';
import { userSeed } from './seeds/user.seed';

const importUsers = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentUsers = await connection.getRepository(UserEntity).find();
  const currentRoles = await connection.getRepository(RoleEntity).find();

  const nonExistUsers = userSeed.filter((newUser) => {
    const check = currentUsers.filter((existUser) => {
      return newUser.email === existUser.email;
    }).length;
    if (check === 0) {
      return true;
    } else {
      console.log(`User '${newUser.email}' is already exist!`);
      return false;
    }
  });

  const nonExistUsersWithRole = nonExistUsers.map((user) => {
    const newRole = currentRoles.filter((existRole) => {
      return existRole.name === user.role;
    });
    if (!newRole[0]) {
      throw new Error(`Role '${user.role}' of '${user.email}' is not exist!`);
    }
    return { ...user, role: newRole[0] };
  });
  const createdRoles = await connection.getRepository(UserEntity).save(
    nonExistUsersWithRole.map((user) => {
      return connection.getRepository(UserEntity).create(user);
    }),
  );

  console.log(`Added ${createdRoles.length} new users!`);
  await connection.close();
};

export default importUsers;
