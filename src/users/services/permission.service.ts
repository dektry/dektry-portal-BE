import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionEntity } from '../entity/permission.entity';
import { permissionRepository } from '../repositories/permission.repository';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async getPermissionById(id: number): Promise<PermissionEntity> {
    const found = await this.permissionRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return found;
  }

  // async createPermission(
  //   pemissionProps: CreatePermissionDto,
  // ): Promise<PermissionEntity> {
  //   const { permission } = pemissionProps;
  //   return this.permissionRepository.save({ permission });
  // }
}
