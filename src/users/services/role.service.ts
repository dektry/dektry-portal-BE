import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { roleRepository } from 'users/repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';
import { PermissionEntity } from '../entity/permission.entity';
import { DeleteResult } from 'typeorm';
import { usersRepository } from '../repositories/users.repository';
import { UserEntity } from 'users/entity/user.entity';

interface RoleProps {
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
    @InjectRepository(usersRepository)
    private usersRepository: usersRepository,
  ) {}

  async getAll(): Promise<RoleEntity[]> {
    const allRoles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    return allRoles;
  }

  async getRoleByName(name: string): Promise<RoleEntity> {
    const found = await this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
    if (!found) {
      throw new NotFoundException(`Role '${name}' not found`);
    }
    return found;
  }

  async createRole(roleProps: RoleProps): Promise<RoleEntity> {
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
    const allExistPermissions: PermissionEntity[] = await this.permissionRepository.find();

    const updatedPermissionsEntity = permissions.map((newRolePermission) => {
      const existPermission: PermissionEntity = allExistPermissions.find(
        (existPermission) => {
          return existPermission.name === newRolePermission;
        },
      );
      return existPermission;
    });

    if (updatedPermissionsEntity.includes(undefined)) {
      throw new NotFoundException(`Permissions is invalid!`);
    }
    const newRoleEntity = this.roleRepository.create({
      name,
      permissions: updatedPermissionsEntity,
    });

    return this.roleRepository.save(newRoleEntity);
  }

  async updateRole(id: string, newRoleProps: RoleProps): Promise<RoleEntity> {
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
    const allExistPermissions: PermissionEntity[] = await this.permissionRepository.find();
    const updatedPermissionsEntity = permissions.map((newRolePermission) => {
      const existPermission: PermissionEntity = allExistPermissions.find(
        (existPermission) => {
          return existPermission.name === newRolePermission;
        },
      );
      return existPermission;
    });
    if (updatedPermissionsEntity.includes(undefined)) {
      throw new NotFoundException(`Permissions is invalid!`);
    }

    const result = await this.roleRepository.save({
      ...role,
      name,
      permissions: updatedPermissionsEntity,
    });
    return result;
  }

  async deleteRole(id: string): Promise<DeleteResult> {
    try {
      const allUsersWithUserThisRole: UserEntity[] = await this.usersRepository.find(
        {
          where: { role: id },
        },
      );
      const userRole: RoleEntity = await this.roleRepository.findOne({
        name: 'user',
      });
      const sudoRole: RoleEntity = await this.roleRepository.findOne({
        name: 'sudo',
      });
      if (sudoRole.id === id) {
        throw new ConflictException(`You can't remove sudo role!`);
      }
      if (userRole.id === id) {
        throw new ConflictException(`You can't remove user's role!`);
      }
      const changedUsers: UserEntity[] = allUsersWithUserThisRole.map(
        (user) => {
          return this.usersRepository.create({ ...user, role: userRole });
        },
      );
      await this.usersRepository.save(changedUsers);
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
