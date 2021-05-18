import { createConnection, Connection } from 'typeorm';
import { UserEntity } from '../src/users/entity/user.entity';
import { RoleEntity } from '../src/users/entity/role.entity';
import { userSeed } from './seeds/user.seed';

const importUsers = async () => {
  const connection: Connection = await createConnection('data-import');
  const newUsers = [];
  for (const user of userSeed) {
    const currentUserIsExist = await connection
      .getRepository(UserEntity)
      .findOne({ email: user.email });
    if (currentUserIsExist) {
      console.log(`User ${user.email} is already exist!`);
    } else {
      const roleEntity = await connection
        .getRepository(RoleEntity)
        .findOne({ name: user.role });
      if (roleEntity) {
        newUsers.push({ ...user, role: roleEntity });
        console.log(`User ${user.email} added!`);
      } else {
        console.log(
          `Role ${user.role} is undefined! Please, check roles import!`,
        );
      }
    }
  }
  await connection.getRepository(UserEntity).save(newUsers);

  await connection.close();
};

export default importUsers;
