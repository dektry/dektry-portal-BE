export const roleSeed = [
  {
    name: 'sudo',
    permissions: [
      'DELETE_USERS',
      'CREATE_USER',
      'GET_USER',
      'GET_ALL_USERS',
      'UPDATE_USER',
      'GET_ALL_ROLES',
      'GET_ROLE_BY_NAME',
      'CREATE_ROLE',
      'UPDATE_ROLE',
      'DELETE_ROLE',
      'GET_PERMISSION_BY_NAME',
      'CREATE_PERMISSION',
      'CREATE_POSITION',
      'UPDATE_POSITION',
      'DELETE_POSITION',
      'GET_ALL_POSITIONS',
    ],
  },
  {
    name: 'user',
    permissions: ['GET_USER'],
  },
  {
    name: 'admin',
    permissions: ['CREATE_USER', 'GET_USER', 'GET_ALL_USERS'],
  },
];
