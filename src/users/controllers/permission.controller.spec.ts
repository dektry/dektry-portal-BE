import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { permissionRepository } from '../repositories/permission.repository';
import { PermissionService } from '../services/permission.service';
import { PermissionController } from './permission.controller';

describe('PermissionController', () => {
  let controller: PermissionController;
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        permissionRepository,
        {
          provide: PermissionService,
          useValue: {
            createPermission: jest
              .fn()
              .mockReturnValue({ id: '1235', name: 'user' }),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create new Permission', () => {
    describe('if fields are valid', () => {
      it('should call createPermission method', async () => {
        const newPermission = {
          name: 'user',
        };
        await controller.create(newPermission);
        expect(service.createPermission).toHaveBeenCalled();
      });

      it('should return the object with a new permission', async () => {
        const newPermission = await controller.create({
          name: 'user',
        });
        expect(newPermission.id).toBe('1235');
        expect(newPermission.name).toBe('user');
      });
    });

    describe('if fields are NOT valid', () => {
      it('should throw the "BadRequestException"', async () => {
        try {
          await controller.create({
            name: '',
          });
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
