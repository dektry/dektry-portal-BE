import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleEntity } from '../entity/role.entity';
import { usersRepository } from '../repositories/users.repository';
const testUser = {
  id: '1',
  firstName: 'Zheniya',
  lastName: 'Best Dev Ever',
  password: 'bestOfTheBest',
  email: 'test@test.com',
  role: RoleEntity['user'],
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  // find: jest.fn(() => [testUser]),
  // findOne: jest.fn(),
  // create: jest.fn(),
  // save: jest.fn(),
  // update: jest.fn(),
  // delete: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testUser),
  find: jest.fn().mockResolvedValue([testUser]),
  findOne: jest.fn().mockResolvedValue(testUser),
  update: jest.fn().mockResolvedValue({ ...testUser, id: 1 }),
  delete: jest.fn().mockResolvedValue(true),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(usersRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository>(
      getRepositoryToken(usersRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('get all users', () => {
  //   it('should return the array of users', async () => {
  //     const expectedUsers = [];
  //     userRepository.find.mockReturnValue(expectedUsers);
  //     const users = await service.getAll();
  //     expect(users.length).toBe(3);
  //   });
  // });

  describe('find User by ID', () => {
    describe('when user with ID exists', () => {
      it('should return the user object', async () => {
        const userId = 1;
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.getUserById(userId);
        expect(user).toEqual(expectedUser);
      });
    });

    describe('when user with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const userId = 1;
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getUserById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID '${userId}' not found`);
        }
      });
    });
  });

  describe('find User by Email', () => {
    describe('when user with Email exists', () => {
      it('should return the user object', async () => {
        const userEmail = 'dm.homza@gmail.com';
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findByEmail(userEmail);
        expect(user).toEqual(expectedUser);
      });
    });

    describe('when user with Email DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const userEmail = 'dm.homza@gmail.com';
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findByEmail(userEmail);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('create new user', () => {
    describe('when all fields passed correctly', () => {
      it('should return the object with new user', async () => {
        const newUser = {
          firstName: 'Zheniya',
          lastName: 'Best Dev Ever',
          password: 'bestOftheBest',
          email: 'test@test.com',
          role: RoleEntity['user'],
        };

        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        const user = await service.createUser(newUser);
        expect(user).toEqual(newUser);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newUser = {
          firstName: '',
          lastName: '',
          password: '',
          email: '',
          role: RoleEntity['user'],
        };
        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        try {
          await service.createUser(newUser);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });

  // describe('updateOne', () => {
  //   it('should call the update method', async () => {
  //     const userId = 1;
  //     const user = await service.getUserById(userId);

  //     const fieldsToUpdate = {
  //       id: user.id,
  //       firstName: 'Gabbi',
  //       lastName: 'Lalala',
  //     };

  //     user.firstName = fieldsToUpdate.firstName;
  //     user.lastName = fieldsToUpdate.lastName;

  //     const newUser = await service.updateUser(fieldsToUpdate);
  //     expect(user).toEqual(newUser);
  //   });
  // });

  describe('update User', () => {
    describe('when the User with ID exists', () => {
      it('should return the object with updated User', async () => {
        const newUser = {
          id: 1,
          firstName: 'Zheniya',
          lastName: 'Best Dev Ever',
          password: 'bestOftheBest',
          email: 'test@test.com',
          role: RoleEntity['user'],
          affected: true,
        };

        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        const user = await service.createUser(newUser);

        const updatedUserName = 'Gabbi';

        user.firstName = updatedUserName;

        userRepository.update.mockReturnValue(user);
        const updatedUser = await service.updateUser(user);

        expect(updatedUser.firstName).toBe(updatedUserName);
      });
    });

    describe('when the User with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        try {
          await service.updateUser(testUser);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `User with ID '${testUser.id}' not found`,
          );
        }
      });
    });
  });

  describe('delete User', () => {
    describe('when the User with ID exists', () => {
      // it('should delete User', async () => {
      //   userRepository.delete.mockResolvedValue(1);
      //   expect(userRepository.delete).not.toHaveBeenCalled();
      //   await userRepository.delete(1);
      //   expect(userRepository.delete).toHaveBeenCalledWith(1);
      // });

      it('should delete User and should throw the "NotFoundException" after GET method', async () => {
        const userId = 1;
        await userRepository.delete(userId);
        try {
          await service.getUserById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID '${userId}' not found`);
        }
      });
    });

    describe('when the User with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const userId = 1;
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getUserById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID '${userId}' not found`);
        }
      });
    });
  });
});
