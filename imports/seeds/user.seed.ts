import { getHashPasswordSync } from '../../utils/hashPassword';

export const userSeed = [
  {
    firstName: 'Dmitriy',
    lastName: 'Homza',
    email: 'dm.homza@gmail.com',
    password: getHashPasswordSync('qwertasdfg'),
    isActive: true,
    birthday: '1990-01-23+02',
  },
  {
    firstName: 'Veronika',
    lastName: 'Moseichik',
    email: 'moseikus@gmail.com',
    password: getHashPasswordSync('qwertasdfg'),
    isActive: true,
    birthday: '2000-01-23+02',
  },
  {
    firstName: 'Eugenuiy',
    lastName: 'Lazarev',
    email: 'laraz@gmail.com',
    password: getHashPasswordSync('qwertasdfg'),
    isActive: true,
    birthday: '1997-01-23+02',
  },
  {
    firstName: 'Jake',
    lastName: 'Gyllenhaal',
    email: 'JG@gmail.com',
    password: getHashPasswordSync('qwertasdfg'),
    isActive: true,
    birthday: '1992-01-23+02',
  },
];
