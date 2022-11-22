import { PermissionEntity } from '../entity/permission.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PermissionEntity)
export class permissionRepository extends Repository<PermissionEntity> {}
