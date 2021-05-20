import { createConnection, Connection } from 'typeorm';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { permissionSeed } from './seeds/permission.seed';

const importPermissions = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentPermissions = await connection
    .getRepository(PermissionEntity)
    .find();
  const nonExistPermissions = permissionSeed.filter((permission) => {
    const check = currentPermissions.filter((existPermission) => {
      return permission.name === existPermission.name;
    }).length;
    if (check === 0) {
      return true;
    } else {
      console.log(`Permission ${permission.name} is already exist!`);
      return false;
    }
  });
  const createdPermissions = await connection
    .getRepository(PermissionEntity)
    .save(
      nonExistPermissions.map((permission) => {
        return connection.getRepository(PermissionEntity).create(permission);
      }),
    );
  console.log(`Added ${createdPermissions.length} new permissions!`);
  await connection.close();
};

export default importPermissions;
