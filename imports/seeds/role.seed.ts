export const roleSeed = [
  {
    name: 'sudo',
    permissions: [
      'deleteUsers',
      'createUser',
      'getUser',
      'getAllUsers',
      'updateUser',
      'getAllRoles',
      'getRoleByName',
      'createRole',
      'updateRole',
      'deleteRole',
      'getPermissionByName',
      'createPermission',
    ],
  },
  {
    name: 'user',
    permissions: ['getUser'],
  },
  {
    name: 'admin',
    permissions: ['createUser', 'getUser', 'getAllUsers'],
  },
];
