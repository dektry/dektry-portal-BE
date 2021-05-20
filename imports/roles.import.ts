import { createConnection, Connection } from 'typeorm';
import { RoleEntity } from '../src/users/entity/role.entity';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { roleSeed } from './seeds/role.seed';

const importRoles = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentRoles = await connection.getRepository(RoleEntity).find();
  const currentPermissions = await connection
    .getRepository(PermissionEntity)
    .find();
  const nonExistRoles = roleSeed.filter((newRole) => {
    const check = currentRoles.filter((existRole) => {
      return newRole.name === existRole.name;
    }).length;
    if (check === 0) {
      return true;
    } else {
      console.log(`Role ${newRole.name} is already exist!`);
      return false;
    }
  });
  const nonExistRolesWithPermissions = nonExistRoles.map((role) => {
    const newRolePermissions = currentPermissions.filter((existPermission) => {
      return (
        role.permissions.filter((newPermission) => {
          return existPermission.name === newPermission;
        }).length !== 0
      );
    });
    return { ...role, permissions: newRolePermissions };
  });
  const createdRoles = await connection.getRepository(RoleEntity).save(
    nonExistRolesWithPermissions.map((role) => {
      return connection.getRepository(RoleEntity).create(role);
    }),
  );

  console.log(`Added ${createdRoles.length} new roles!`);
  await connection.close();
};

export default importRoles;
