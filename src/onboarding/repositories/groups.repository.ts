import { GroupsEntity } from '../entity/groups.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GroupsEntity)
export class groupsRepository extends Repository<GroupsEntity> {}
