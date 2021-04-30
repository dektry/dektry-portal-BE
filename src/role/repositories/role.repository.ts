import { role } from '../entity/role.entity';
import {
  EntityRepository,
  Repository,
  getRepository,
  getManager,
} from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { permission } from 'src/permission/entity/permission.entity';

@EntityRepository(role)
export class roleRepository extends Repository<role> {
  async createRole(createRoleDto: CreateRoleDto): Promise<role> {
    const entityManager = getManager();
    const { roleName, permission: permissions } = createRoleDto;
    const roles = new role();
    roles.permission = [];
    permissions.forEach(async (item) => {
      const permissionObject = await entityManager.findOne(permission, item);
      roles.permission.push(permissionObject);
    });
    roles.roleName = roleName;
    await roles.save();
    return roles;
  }
}
