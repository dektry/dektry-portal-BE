import { createConnection, Connection } from 'typeorm';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { permissionSeed } from './seeds/permission.seed';

const importPermissions = async () => {
  const connection: Connection = await createConnection('data-import');
  for (const permission of permissionSeed) {
    const currentPermissionIsExist = await connection
      .getRepository(PermissionEntity)
      .findOne({ name: permission.name });
    if (currentPermissionIsExist) {
      console.log(`Permission ${permission.name} is already exist!`);
    } else {
      await connection
        .getRepository(PermissionEntity)
        .save(
          await connection.getRepository(PermissionEntity).create(permission),
        );
      console.log(`Permission ${permission.name} added!`);
    }
  }
  console.log('Permissions is updated!');
  await connection.close();
};

export default importPermissions;
