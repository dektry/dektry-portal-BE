import { AccessEntity } from '../entity/access.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(AccessEntity)
export class accessRepository extends Repository<AccessEntity> {}
