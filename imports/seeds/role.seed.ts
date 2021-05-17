export const roleSeed = [
  {
    roleName: 'sudo',
    permission: ['getUser', 'getAllUsers', 'createUsers', 'deleteUsers'],
  },
  {
    roleName: 'user',
    permission: ['getUser', 'getAllUsers', 'createUsers'],
  },
  {
    roleName: 'admin',
    permission: ['getUser'],
  },
];
