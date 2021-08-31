import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { RoleService } from './role.service';
import { roleRepository } from '../repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { usersRepository } from '../repositories/users.repository';
import { PermissionService } from './permission.service';
import { PermissionEntity } from '../entity/permission.entity';
import { NotFoundException } from '@nestjs/common';

const testRole = {
  id: '1',
  name: 'user',
  permissions: PermissionEntity['user'],
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockReturnValue(testRole),
  find: jest.fn().mockResolvedValue([testRole]),
});

describe('RoleService', () => {
  let service: RoleService;
  let permissionsService: PermissionService;
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
        {
          provide: getRepositoryToken(usersRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    permissionsService = module.get<PermissionService>(PermissionService);
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

  describe('get all roles', () => {
    it('should return the array of users', async () => {
      const createQueryBuilder: any = {
        getRawMany: () => [testRole],
      };

      jest
        .spyOn(rolesRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      rolesRepository.find.mockReturnValue([testRole]);
      await expect(service.getAll()).resolves.toEqual([testRole]);
    });
  });

  describe('find Role by ID', () => {
    describe('when Role with ID exists', () => {
      it('should return the role object', async () => {
        const expectedRole = {};
        const roleName = 'Back-end developer';
        rolesRepository.findOne.mockReturnValue(expectedRole);
        const role = await service.getRoleByName(roleName);
        expect(role).toEqual(expectedRole);
      });
    });

    describe('when Role with name DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        rolesRepository.findOne.mockReturnValue(undefined);
        const roleName = 'Back-end developer';
        try {
          await service.getRoleByName(roleName);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Role '${roleName}' not found`);
        }
      });
    });
  });

  describe('create new Role', () => {
    it('should return the object with new Role', async () => {
      const expectedPermission = ['user'];

      const newPermission = {
        name: 'user',
      };

      permissionsRepository.create.mockReturnValue(newPermission);
      permissionsRepository.save.mockReturnValue(newPermission);
      const permission = await permissionsService.createPermission(
        newPermission,
      );
      const newRole = {
        name: 'users',
        permissions: expectedPermission,
      };
      rolesRepository.save.mockReturnValue(newRole);
      rolesRepository.find.mockReturnValue([newRole]);

      const role = await service.createRole(newRole);
      expect(role).toEqual(newRole);
    });
  });
});
