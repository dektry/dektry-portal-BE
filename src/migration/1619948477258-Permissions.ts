import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { PermissionEntity } from '../users/entity/permission.entity';
import { permissionSeed } from 'src/seeds/permission.seed';

export class Permissions1619948477258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository(PermissionEntity).save(permissionSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
