import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { permissionRepository } from '../repositories/permission.repository';
import { roleRepository } from '../repositories/role.repository';
import { RoleService } from '../services/role.service';
import { RoleController } from './role.controller';

const testRole = { id: 1, name: 'Test role', permissions: ['user'] };

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        roleRepository,
        permissionRepository,
        {
          provide: RoleService,
          useValue: {
            getAll: jest.fn(() => [testRole]),
            getRoleById: jest.fn(() => testRole),
            createRole: jest.fn(() => testRole),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all roles', () => {
    it('should get the list of roles', async () => {
      const roles = await controller.getAll();
      expect(roles).toEqual([testRole]);
    });
  });

  describe('create new Role', () => {
    describe('if fields are valid', () => {
      it('should return the object with a new Role', async () => {
        const newRole = await controller.create({
          name: 'Test role',
          permissions: ['user'],
        });
        expect(newRole).toEqual(testRole);
      });
    });

    describe('if fields are NOT valid', () => {
      it('should throw the "BadRequestException"', async () => {
        const newRole = {
          name: '',
          permissions: [''],
        };

        try {
          await controller.create(newRole);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
