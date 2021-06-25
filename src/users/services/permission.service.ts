import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../entity/permission.entity';
import { permissionRepository } from '../repositories/permission.repository';

interface PermissionProps {
  name: string;
}

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async getAll(): Promise<PermissionEntity[]> {
    const allPermissions = await this.permissionRepository.find();
    return allPermissions;
  }

  async createPermission(
    permissionProps: PermissionProps,
  ): Promise<PermissionEntity> {
    const { name } = permissionProps;
    const permission = await this.permissionRepository.findOne({ name });
    if (permission) {
      throw new BadRequestException(`This permission is already exist!`);
    }
    if (!name) {
      throw new BadRequestException(`Please, send correct permission name!`);
    }
    return this.permissionRepository.save({ name });
  }

  async getByName(name: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({ name });
    if (permission) {
      return permission;
    } else {
      throw new NotFoundException(`Sorry, '${name}' permission not found!`);
    }
  }
}
