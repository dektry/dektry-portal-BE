import { createConnection, Connection } from 'typeorm';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { permissionSeed } from './seeds/permission.seed';

const importPermissions = async () => {
  const connection: Connection = await createConnection('data-import');
  const permRepository = connection.getRepository(PermissionEntity);
  await permRepository.save(permissionSeed);
  console.log('Permissions imported!');
  await connection.close();
};

export default importPermissions;
