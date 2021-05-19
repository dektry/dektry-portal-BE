import { Test, TestingModule } from '@nestjs/testing';
import { usersRepository } from '../repositories/users.repository';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

const testUser = {
  id: 1,
  firstName: 'Zheniya',
  lastName: 'Best Dev Ever',
  password: 'bestOfTheBest',
  email: 'test@test.com',
  role: ['user'],
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        usersRepository,
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn(() => [testUser]),
            getUserById: jest.fn(() => testUser),
            createUser: jest.fn(() => testUser),
            updateUser: jest.fn(() => testUser),
            deleteUser: jest.fn(() => testUser.id),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all users', () => {
    it('should get the list of users', async () => {
      const users = await controller.getAll();
      expect(users).toEqual([testUser]);
    });
  });
});
