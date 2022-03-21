import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CareerEntity } from '../entity/career.entity';
import { RoleEntity } from '../entity/role.entity';
import { usersRepository } from '../repositories/users.repository';
import { accessRepository } from '../repositories/access.repository';
import { roleRepository } from '../repositories/role.repository';
import { careerRepository } from '../repositories/career.repository';
import { projectsRepository } from '../../projects/repositories/projects.repository';
import { projectsHistoryRepository } from '../../projects/repositories/projectsHistory.repository';
import { positionGroupRepository } from '../repositories/positionGroup.repository';

const testUser = {
  id: '1',
  firstName: 'Zheniya',
  lastName: 'Best Dev Ever',
  password: 'bestOfTheBest',
  email: 'test@test.com',
  role: RoleEntity['user'],
  isActive: true,
  birthday: new Date(),
  career: CareerEntity['1'],
  projects: [],
  projectsHistory: [],
};

const page = 1;
const limit = 10;

const result = {
  results: [testUser],
  total: 1,
  currentPage: page,
  next: page + 1,
  previous: page - 1,
};

const newUser = {
  firstName: 'Zheniya',
  lastName: 'Best Dev Ever',
  password: 'bestOftheBest',
  email: 'test@test.com',
  role: RoleEntity['user'],
  isActive: true,
  birthday: new Date(),
  career: CareerEntity['1'],
};

const existUser = undefined;

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testUser),
  createQueryBuilder: jest.fn(),
  findOne: jest.fn().mockReturnValue(testUser),
  update: jest.fn().mockResolvedValue(testUser),
  delete: jest.fn().mockResolvedValue(true),
  find: jest.fn().mockResolvedValue([testUser]),
  remove: jest.fn().mockResolvedValue([]),
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
          provide: getRepositoryToken(roleRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(careerRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(accessRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(projectsRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(projectsHistoryRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(positionGroupRepository),
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

  describe('get all users', () => {
    it('should return the array of users', async () => {
      let createQueryBuilder: any = {
        leftJoinAndSelect: () => createQueryBuilder,
      };

      createQueryBuilder = {
        ...createQueryBuilder,
        leftJoinAndSelectе: () => createQueryBuilder,
        select: () => createQueryBuilder,
        getRawMany: () => [],
      };

      jest
        .spyOn(userRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await expect(service.getAll(page, limit)).resolves.toEqual(result);
    });
  });

  describe('find User by ID', () => {
    describe('when user with ID exists', () => {
      it('should return the user object', async () => {
        const userId = '1';
        const expectedUser = {
          career: [
            {
              to: '2012-01-23T22:15:51.000Z',
              position: { name: 'Full stack trainee' },
            },
          ],
        };

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.getUserById(userId);
        expect(user).toEqual({
          ...expectedUser,
          currentPositions: expect.arrayContaining([]),
        });
      });
    });

    describe('when user with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const userId = '1';
        userRepository.findOne.mockReturnValue(existUser);

        try {
          await service.getUserById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('find User by Email', () => {
    describe('when user with Email exists', () => {
      it('should return the user object', async () => {
        const userEmail = 'dm.homza@gmail.com';
        const expectedUser = {
          career: [
            {
              to: '2012-01-23T22:15:51.000Z',
              position: { name: 'Full stack trainee' },
            },
          ],
        };

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.findByEmail(userEmail);
        expect(user).toEqual({
          ...expectedUser,
          currentPositions: expect.arrayContaining([]),
        });
      });
    });

    describe('when user with Email DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const userEmail = 'dm.homza@gmail.com';
        userRepository.findOne.mockReturnValue(existUser);

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
        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        userRepository.findOne.mockReturnValue(existUser);
        const user = await service.createUser(newUser);
        expect(user).toEqual(newUser);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "ConflictException"', async () => {
        const newUser = {
          firstName: '',
          lastName: '',
          password: '',
          email: '',
          role: RoleEntity['user'],
          isActive: true,
          birthday: new Date(),
          career: CareerEntity['1'],
        };
        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        try {
          await service.createUser(newUser);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
        }
      });
    });
  });

  describe('update User', () => {
    describe('when the User with ID exists', () => {
      it('should return the object with updated User', async () => {
        const id = '1';
        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        userRepository.findOne.mockReturnValue(existUser);
        const user = await service.createUser(newUser);
        const updatedUserName = 'Gabbi';

        user.firstName = updatedUserName;

        userRepository.update.mockReturnValue(user);
        userRepository.findOne.mockReturnValue(user);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const updatedUser = await service.updateUser(id, user);

        expect(updatedUser.firstName).toBe(updatedUserName);
      });
    });

    describe('when the User with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const id = '1';
        try {
          await service.updateUser(id, testUser);
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
      it('should delete User', async () => {
        userRepository.delete.mockResolvedValue(1);
        expect(userRepository.delete).not.toHaveBeenCalled();
        await userRepository.delete(1);
        expect(userRepository.delete).toHaveBeenCalledWith(1);
      });

      it('should delete User and should throw the "NotFoundException" after GET method', async () => {
        userRepository.create.mockReturnValue(newUser);
        userRepository.save.mockReturnValue(newUser);
        userRepository.findOne.mockReturnValue(existUser);
        const user = await service.createUser(newUser);
        userRepository.delete.mockReturnValue(user);

        // careersRepository.remove.mockReturnValue([deletedUser.career]);

        const dto = {
          id: '1',
        };
        userRepository.findOne.mockReturnValue(newUser);
        userRepository.remove.mockReturnValue([]);
        await service.deleteUser(dto);
        try {
          userRepository.findOne.mockReturnValue(existUser);
          await service.getUserById(dto.id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID '${dto.id}' not found`);
        }
      });
    });

    describe('when the User with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const testUser = {
          id: 1,
          firstName: 'Zheniya',
          lastName: 'Best Dev Ever',
          password: 'bestOfTheBest',
          email: 'test@test.com',
          role: RoleEntity['user'],
        };

        const dto = {
          id: testUser.id,
        };

        try {
          await service.deleteUser(dto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with ID '${dto.id}' not found`);
        }
      });
    });
  });
});
