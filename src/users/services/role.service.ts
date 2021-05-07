import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleEntity } from '../entity/role.entity';
import { roleRepository } from '../../users/repositories/role.repository';
import { permissionRepository } from '../repositories/permission.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(roleRepository)
    private roleRepository: roleRepository,
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async getRoleById(id: number): Promise<RoleEntity> {
    const found = await this.roleRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return found;
  }

  async createRole(roleProps: CreateRoleDto): Promise<RoleEntity> {
    const { roleName, permission } = roleProps;
    let permissions = [];
    for (const item of permission) {
      const newPermission = await this.permissionRepository.findOne(item);
      permissions = [...permissions, newPermission];
    }
    const newRoleEntity = this.roleRepository.create({
      roleName,
      permission: permissions,
    });
    return this.roleRepository.save(newRoleEntity);
  }
}
