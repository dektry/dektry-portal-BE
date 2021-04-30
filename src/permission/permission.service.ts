import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { permission } from './entity/permission.entity';
import { permissionRepository } from './repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async getPermissionById(id: number): Promise<permission> {
    const found = await this.permissionRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return found;
  }

  async createPermission(
    CreatePermissionDto: CreatePermissionDto,
  ): Promise<permission> {
    return this.permissionRepository.createPermission(CreatePermissionDto);
  }
}
