import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleEntity } from '../entity/role.entity';
import { usersRepository } from '../repositories/users.repository';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

const testUser = {
  id: '1',
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

  describe('get User by ID', () => {
    describe('when user with ID exists', () => {
      it('should get the user matching the id', async () => {
        const user = await controller.getUserById(1);
        expect(user).toEqual(testUser);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await controller.getUserById(10);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('create new User', () => {
    describe('if fields are valid', () => {
      it('should return the object with a new User', async () => {
        const newUser = await controller.createUser({
          firstName: 'Zheniya',
          lastName: 'Best Dev Ever',
          password: 'bestOfTheBest',
          email: 'test@test.com',
          role: RoleEntity['user'],
        });
        expect(newUser).toEqual(testUser);
      });
    });

    describe('if fields are NOT valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newUser = {
          firstName: '',
          lastName: '',
          password: '',
          email: '',
          role: RoleEntity['user'],
        };

        try {
          await controller.createUser(newUser);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });

  describe('update User', () => {
    describe('when user with ID exists', () => {
      it('should get the user matching the id and update it', async () => {
        const user = await controller.getUserById(1);

        const fieldsToUpdate = {
          id: user.id,
          firstName: 'Gabbi',
          lastName: 'Lalala',
        };

        user.firstName = fieldsToUpdate.firstName;
        user.lastName = fieldsToUpdate.lastName;

        const newUser = await controller.updateUser(fieldsToUpdate);
        expect(user).toEqual(newUser);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await controller.deleteUser('100');
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('delete User', () => {
    describe('when user with ID exists', () => {
      it('should get the user matching the id and delete it', async () => {
        const user = await controller.deleteUser('1');
        expect(user).toEqual(testUser.id);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await controller.deleteUser('100');
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
