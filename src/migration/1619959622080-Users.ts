import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { RoleEntity } from 'src/users/entity/role.entity';
import { userSeed } from 'src/seeds/user.seed';
import { UserEntity } from 'src/users/entity/user.entity';

export class Users1619959622080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const newUsers = [];
    for (const user of userSeed) {
      const roleEntity = await getRepository(RoleEntity).findOne(user.role);
      newUsers.push({ ...user, role: roleEntity });
    }
    await getRepository(UserEntity).save(newUsers);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
