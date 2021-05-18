import { createConnection, Any, Connection } from 'typeorm';
import { RoleEntity } from '../src/users/entity/role.entity';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { roleSeed } from './seeds/role.seed';

const importRoles = async () => {
  const connection: Connection = await createConnection('data-import');
  const newRoles = [];
  for (const role of roleSeed) {
    const currentRoleIsExist = await connection
      .getRepository(RoleEntity)
      .findOne({ name: role.name });
    if (currentRoleIsExist) {
      console.log(`Role ${role.name} is already exist!`);
    } else {
      const permissionsObj = await connection
        .getRepository(PermissionEntity)
        .find({
          name: Any(role.permissions),
        });
      newRoles.push({ ...role, permissions: permissionsObj });
      await connection.getRepository(RoleEntity).save(newRoles);
      console.log(`Role ${role.name} added!`);
    }
  }

  await connection.close();
};

export default importRoles;
