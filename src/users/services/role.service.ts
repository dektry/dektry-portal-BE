import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { roleRepository } from '../../users/repositories/role.repository';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { permissionRepository } from '../repositories/permission.repository';

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

  async createRole(roleProps): Promise<RoleEntity> {
    const { name, permissions } = roleProps;
    let permissionsEntity = [];
    const isExist = await this.roleRepository.findOne({
      name,
    });
    if (isExist) {
      throw new ConflictException(`Role '${name}' is already exist!`);
    }
    for (const permission of permissions) {
      const newPermission = await this.permissionRepository.findOne({
        name: permission,
      });
      if (!newPermission) {
        throw new NotFoundException(`Permission '${permission}' not found`);
      }
      permissionsEntity = [...permissionsEntity, newPermission];
    }
    const newRoleEntity = this.roleRepository.create({
      name,
      permissions: permissionsEntity,
    });
    return this.roleRepository.save(newRoleEntity);
  }

  async updateRole(id: string, newRoleProps): Promise<any> {
    const { name, permissions } = newRoleProps;
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    let permissionsEntity = [];
    for (const permission of permissions) {
      const newPermission = await this.permissionRepository.findOne({
        name: permission,
      });
      if (!newPermission) {
        throw new NotFoundException(`Permission '${permission}' not found`);
      }
      permissionsEntity = [...permissionsEntity, newPermission];
    }
    role.name = name;
    role.permissions = permissionsEntity;
    const result = await this.roleRepository.save(role);
    return result;
  }

  async deleteRole(id): Promise<any> {
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
