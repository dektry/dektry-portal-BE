import { Injectable } from '@nestjs/common';
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

  async createPermission(
    pemissionProps: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const { permission } = pemissionProps;
    return this.permissionRepository.save({ name: permission });
  }
}
