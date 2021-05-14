import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleEntity } from '../entity/role.entity';
import { usersRepository } from '../repositories/users.repository';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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
        // {
        //   provide: getRepositoryToken(RoleEntity),
        //   useValue: createMockRepository(),
        // },
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

  describe('findOne', () => {
    describe('when user with ID exists', () => {
      it('should return the user object', async () => {
        const userId = 1;
        const expectedUser = {};

        userRepository.findOne.mockReturnValue(expectedUser);
        const user = await service.getUserById(userId);
        expect(user).toEqual(expectedUser);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const userId = 1;
        userRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getUserById(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
