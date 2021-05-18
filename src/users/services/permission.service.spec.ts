import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { permissionRepository } from '../repositories/permission.repository';
import { PermissionService } from './permission.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionsRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(permissionRepository),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionsRepository = module.get<MockRepository>(
      getRepositoryToken(permissionRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find Permission by ID', () => {
    describe('when Permission with ID exists', () => {
      it('should return the user object', async () => {
        const permissionId = 1;
        const expectedPermission = {};

        permissionsRepository.findOne.mockReturnValue(expectedPermission);
        const permission = await service.getPermissionById(permissionId);
        expect(permission).toEqual(expectedPermission);
      });
    });

    describe('when Permission with ID DOES NOT exist', () => {
      it('should throw the "NotFoundException"', async () => {
        const permissionId = 1;
        permissionsRepository.findOne.mockReturnValue(undefined);

        try {
          await service.getPermissionById(permissionId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Permission with ID "${permissionId}" not found`,
          );
        }
      });
    });
  });

  describe('create new Permission', () => {
    describe('when all fields passed correctly', () => {
      it('should return the object with new Permission', async () => {
        const newPermission = {
          permission_type: 'users',
          R: true,
          W: true,
        };

        permissionsRepository.create.mockReturnValue(newPermission);
        permissionsRepository.save.mockReturnValue(newPermission);
        const permission = await service.createPermission(newPermission);
        expect(permission).toEqual(newPermission);
      });
    });

    describe('when fields are not valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newPermission = {
          permission_type: '',
          R: 'true',
          W: 1,
        };
        permissionsRepository.create.mockReturnValue(newPermission);
        permissionsRepository.save.mockReturnValue(newPermission);
        try {
          await service.createPermission(newPermission);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
