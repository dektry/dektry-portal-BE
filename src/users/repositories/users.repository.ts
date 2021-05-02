import { UserEntity } from '../entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(UserEntity)
export class usersRepository extends Repository<UserEntity> {}
