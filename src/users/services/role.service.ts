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

  async getAll(): Promise<RoleEntity[]> {
    const allRoles = await this.roleRepository
      .createQueryBuilder('role')
      .getRawMany();
    return allRoles;
  }

  async getRoleById(id: number): Promise<RoleEntity> {
    const found = await this.roleRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return found;
  }

  async createRole(roleProps: CreateRoleDto): Promise<RoleEntity> {
    const { name, permissions } = roleProps;
    let permissionsEntity = [];
    for (const permission of permissions) {
      const newPermission = await this.permissionRepository.findOne({
        name: permission,
      });
      permissionsEntity = [...permissionsEntity, newPermission];
    }
    const newRoleEntity = this.roleRepository.create({
      name,
      permissions: permissionsEntity,
    });
    return this.roleRepository.save(newRoleEntity);
  }
}
