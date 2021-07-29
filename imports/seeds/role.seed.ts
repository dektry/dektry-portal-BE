import { Permissions } from '../../src/enums/permissions.enum';

export const roleSeed = [
  {
    name: 'admin',
    permissions: [
      Permissions.deleteUsers,
      Permissions.createUser,
      Permissions.getUser,
      Permissions.getAllUsers,
      Permissions.getAllRoles,
      Permissions.getRoleByName,
      Permissions.createRole,
      Permissions.updateRole,
      Permissions.deleteRole,
      Permissions.getPermissionByName,
      Permissions.createPermission,
      Permissions.getAllPositions,
      Permissions.createPosition,
      Permissions.updatePosition,
      Permissions.deletePosition,
      Permissions.getCareer,
      Permissions.createCareer,
      Permissions.deleteCareer,
      Permissions.getAllPermissions,
      Permissions.getAllArticles,
    ],
  },
  {
    name: 'user',
    permissions: [Permissions.getUser, Permissions.getAllUsers],
  },
];
