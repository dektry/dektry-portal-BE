export const roleSeed = [
  {
    name: 'sudo',
    permissions: [
      'deleteUsers',
      'createUser',
      'getUser',
      'getAllUsers',
      'updateUser',
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
