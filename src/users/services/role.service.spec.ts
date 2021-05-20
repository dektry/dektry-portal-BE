import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { RoleService } from './role.service';
import { roleRepository } from '../repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { NotFoundException } from '@nestjs/common';
import { PermissionService } from './permission.service';

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
        PermissionService,
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

  describe('find Role by name', () => {
    describe('when Role with NAME exists', () => {
      it('should return the role object', async () => {
        const roleName = 'sudo';
        const expectedRole = {};

        rolesRepository.findOne.mockReturnValue(expectedRole);
        const role = await service.getRoleByName(roleName);
        expect(role).toEqual(expectedRole);
      });
    });

    describe('when Role with NAME DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const roleName = 'sudo';
        rolesRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getRoleByName(roleName);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Role with name "${roleName}" not found`);
        }
      });
    });
  });
});
