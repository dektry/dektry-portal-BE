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
  let permService: PermissionService;
  let rolesRepository: MockRepository;
  let permissionsRepository: MockRepository;

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
    permService = module.get<PermissionService>(PermissionService);
    rolesRepository = module.get<MockRepository>(
      getRepositoryToken(roleRepository),
    );
    permissionsRepository = module.get<MockRepository>(
      getRepositoryToken(permissionRepository),
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

    describe('when Role with ID DOES NOT exist', () => {
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

  describe('create new Role', () => {
    it('should create the new role object', async () => {
      const permissionId = 2;

      let expectedPermission = [];

      permissionsRepository.findOne.mockReturnValue(expectedPermission);
      const permission = await permService.getPermissionById(permissionId);

      expectedPermission = [{ ...permission }];
      const newRole = {
        roleName: 'user',
        permission: expectedPermission,
      };

      rolesRepository.create.mockReturnValue(newRole);
      rolesRepository.save.mockReturnValue(newRole);
      const role = await service.createRole(newRole);
      expect(role).toEqual(newRole);
    });
  });
});
