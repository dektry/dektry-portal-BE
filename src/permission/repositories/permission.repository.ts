import { permission } from '../entity/permission.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@EntityRepository(permission)
export class permissionRepository extends Repository<permission> {
  async createPermission(
    CreatePermissionDto: CreatePermissionDto,
  ): Promise<permission> {
    const { permission_type } = CreatePermissionDto;

    const permissions = new permission();
    permissions.permission_type = permission_type;
    await permissions.save();
    return permissions;
  }
}
