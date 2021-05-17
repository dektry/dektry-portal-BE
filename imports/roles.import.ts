import { createConnection, Connection } from 'typeorm';
import { RoleEntity } from '../src/users/entity/role.entity';
import { PermissionEntity } from '../src/users/entity/permission.entity';
import { roleSeed } from '../src/seeds/role.seed';

const importRoles = async () => {
  // const connection: Connection = await createConnection('data-import');
  // const roleRepository = connection.getRepository(RoleEntity);
  // const permissionRepository = connection.getRepository(PermissionEntity);
  // roleSeed.map(async (item) => {
  //   const { roleName, permission } = item;
  //   let permissions = [];
  //   permission.map(async (perm) => {
  //     const newPermission = await permissionRepository.findOne({
  //       permission: perm,
  //     });
  //     console.log(newPermission);
  //     permissions = [...permissions, newPermission];
  //   });
  //   const newRoleEntity = roleRepository.create({
  //     roleName,
  //     permission: permissions,
  //   });
  //   roleRepository.save(newRoleEntity);
  // });
  // console.log('Roles imported!');
  // await connection.close();
};

export default importRoles;
