import { createConnection, Connection } from 'typeorm';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { permissionSeed } from './seeds/permission.seed';
import _ = require('lodash');

const importPermissions = async () => {
  const connection: Connection = await createConnection('data-import');
  const currentPermissions = await connection
    .getRepository(PermissionEntity)
    .find();

  const newPermissions = permissionSeed.filter((newPermission) => {
    const isPermissionExist = currentPermissions.some(
      (existPermission) => newPermission.name === existPermission.name,
    );
    return !isPermissionExist;
  });
  const alreadyExistedNewPermissions = _.difference(
    permissionSeed,
    newPermissions,
  );
  alreadyExistedNewPermissions.forEach((element) => {
    console.log(`Permission ${element.name} is already exist!`);
  });

  const createdPermissions = await connection
    .getRepository(PermissionEntity)
    .save(
      newPermissions.map((permission) => {
        return connection.getRepository(PermissionEntity).create(permission);
      }),
    );
  console.log(`Added ${createdPermissions.length} new permissions!`);
  await connection.close();
};

export default importPermissions;
