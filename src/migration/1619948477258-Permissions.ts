import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { PermissionEntity } from '../users/entity/permission.entity';

export class Permissions1619948477258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permission = await getRepository(PermissionEntity).save({
      permission_type: 'usersEdit',
    });
    console.log(permission);
    console.log('kdj');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
