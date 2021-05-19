import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../entity/permission.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { permissionRepository } from '../repositories/permission.repository';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(permissionRepository)
    private permissionRepository: permissionRepository,
  ) {}

  async createPermission(pemissionProps): Promise<PermissionEntity> {
    const { name } = pemissionProps;
    if (!name) {
      throw new NotFoundException(`Please, send coorect permission name!`);
    }
    const isExist = await this.permissionRepository.findOne({ name });
    if (isExist) {
      throw new ConflictException(`Permission ${name} is already exist!`);
    } else {
      return this.permissionRepository.save({ name });
    }
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
