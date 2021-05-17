import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { RoleService } from './role.service';
import { roleRepository } from '../repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('RoleService', () => {
  let service: RoleService;
  let rolesRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(roleRepository),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(permissionRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    rolesRepository = module.get<MockRepository>(
      getRepositoryToken(roleRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find Role by ID', () => {
    describe('when Role with ID exists', () => {
      it('should return the role object', async () => {
        const roleId = 1;
        const expectedRole = {};

        rolesRepository.findOne.mockReturnValue(expectedRole);
        const role = await service.getRoleById(roleId);
        expect(role).toEqual(expectedRole);
      });
    });

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const roleId = 1;
        rolesRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getRoleById(roleId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Role with ID "${roleId}" not found`);
        }
      });
    });
  });
});
