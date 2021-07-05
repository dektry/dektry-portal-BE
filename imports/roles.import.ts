import { createConnection, Connection } from 'typeorm';
import { RoleEntity } from '../src/users/entity/role.entity';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { roleSeed } from './seeds/role.seed';
import { difference } from 'lodash';

const importRoles = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentRoles = await connection.getRepository(RoleEntity).find();
  const allExistPermissions = await connection
    .getRepository(PermissionEntity)
    .find();

  //Check role name to unque
  const newRoles = roleSeed.filter((newRole) => {
    const isRoleExist = currentRoles.some(
      (existRole) => newRole.name === existRole.name,
    );
    return !isRoleExist;
  });
  const alreadyExistedNewRoles = difference(roleSeed, newRoles);
  alreadyExistedNewRoles.forEach((element) => {
    console.log(`Role '${element.name}' is already exist!`);
  });

  //Add permissions entity to new roles
  const newRolesWithRelations = newRoles.map((role) => {
    const permissionEntity = allExistPermissions.filter((existPermission) => {
      return role.permissions.some(
        (newPermission) => existPermission.name === newPermission,
      );
    });
    return { ...role, permissions: permissionEntity };
  });

  const createdRoles = await connection.getRepository(RoleEntity).save(
    newRolesWithRelations.map((role) => {
      return connection.getRepository(RoleEntity).create(role);
    }),
  );

  console.log(`Added ${createdRoles.length} new roles!`);
  await connection.close();
};

export default importRoles;
