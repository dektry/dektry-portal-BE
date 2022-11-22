import { RoleEntity } from '../entity/role.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RoleEntity)
export class roleRepository extends Repository<RoleEntity> {}
