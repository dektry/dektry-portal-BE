import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleEntity } from '../entity/role.entity';
import { CareerEntity } from '../entity/career.entity';
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
  isActive: true,
  birthday: '1998-01-23T22:15:51.000Z',
  career: ['Full stack trainee'],
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
        const user = await controller.getUserById('1');
        expect(user).toEqual(testUser);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await controller.getUserById('10');
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
          birthday: new Date('1998-01-23T22:15:51.000Z'),
          isActive: true,
          career: CareerEntity[''],
          role: RoleEntity['Full stack trainee'],
        });
        expect(newUser).toEqual(testUser);
      });
    });

    describe('if fields are NOT valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newUser = {
          firstName: 'Zheniya',
          lastName: 'Best Dev Ever',
          password: 'bestOfTheBest',
          email: 'test@test.com',
          birthday: new Date('1998-01-23T22:15:51.000Z'),
          isActive: true,
          career: CareerEntity[''],
          role: RoleEntity[''],
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
        const user = await controller.getUserById(testUser.id);

        const fieldsToUpdate = {
          ...user,
          firstName: 'Gabbi',
          lastName: 'Lalala',
        };

        user.firstName = fieldsToUpdate.firstName;
        user.lastName = fieldsToUpdate.lastName;

        const newUser = await controller.updateUser(user.id, fieldsToUpdate);
        expect(user).toEqual(newUser);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await controller.getUserById(testUser.id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('delete User', () => {
    describe('when user with ID exists', () => {
      it('should get the user matching the id and delete it', async () => {
        const user = await controller.getUserById(testUser.id);
        const userToDelete = await controller.deleteUser(testUser.id);
        expect(user.id).toEqual(userToDelete);
      });
    });

    describe('when user with ID DOES NOT exists', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          const dto = { id: '100' };
          await controller.deleteUser(dto.id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
