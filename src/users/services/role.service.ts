import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { roleRepository } from 'src/users/repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { resultResponse } from '../user.intrfaces';
import { PermissionEntity } from '../entity/permission.entity';

interface roleProps {
  name: string;
  permissions: string[];
}

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async getAll(): Promise<RoleEntity[]> {
    const allRoles = await this.roleRepository.find({
      relations: ['permissions'],
    });
    return allRoles;
  }

  async getRoleByName(name: string): Promise<RoleEntity> {
    const found = await this.roleRepository.findOne({ name });
    if (!found) {
      throw new NotFoundException(`Role '${name}' not found`);
    }
    return found;
  }

  async createRole(roleProps: roleProps): Promise<RoleEntity> {
    const { name, permissions } = roleProps;
    if (!permissions) {
      throw new ConflictException(`Please add permissions!`);
    }
    if (!name) {
      throw new ConflictException(`Please add role name!`);
    }
    const isExist = await this.roleRepository.findOne({
      name,
    });
    if (isExist) {
      throw new ConflictException(`Role '${name}' is already exist!`);
    }
    const existPermissions: PermissionEntity[] =
      await this.permissionRepository.find();
    const permissionsEntity = permissions.map((newRolePermission) => {
      const permissionEntity: PermissionEntity = existPermissions.find(
        (existPermission) => {
          return existPermission.name === newRolePermission;
        },
      );
      if (!permissionEntity) {
        throw new NotFoundException(
          `Permission '${newRolePermission}' not found`,
        );
      }
      return permissionEntity;
    });
    const newRoleEntity = this.roleRepository.create({
      name,
      permissions: permissionsEntity,
    });
    return this.roleRepository.save(newRoleEntity);
  }

  async updateRole(id: string, newRoleProps: roleProps): Promise<RoleEntity> {
    const { name, permissions } = newRoleProps;
    const role = await this.roleRepository.findOne(id);
    if (!permissions) {
      throw new ConflictException(`Please add permissions!`);
    }
    if (!name) {
      throw new ConflictException(`Please add role name!`);
    }
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    const existPermissions: PermissionEntity[] =
      await this.permissionRepository.find();
    const permissionsEntity: PermissionEntity[] = permissions.map(
      (newRolePermission) => {
        const rolePermission: PermissionEntity = existPermissions.find(
          (existPermission) => {
            return existPermission.name === newRolePermission;
          },
        );
        if (!rolePermission) {
          throw new NotFoundException(
            `Permission '${newRolePermission}' not found`,
          );
        }
        return rolePermission;
      },
    );
    const result = await this.roleRepository.save({
      name,
      permissions: permissionsEntity,
      ...role,
    });
    return result;
  }

  async deleteRole(id: string): Promise<resultResponse> {
    try {
      const result = await this.roleRepository.delete(id);
      if (!result.affected) {
        throw new NotFoundException(`Role with ID '${id}' not found`);
      }
      return result;
    } catch (error) {
      return error;
    }
  }
}
