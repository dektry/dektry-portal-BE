import { MigrationInterface, QueryRunner, getRepository, Any } from 'typeorm';
import { RoleEntity } from 'src/users/entity/role.entity';
import { roleSeed } from 'src/seeds/role.seed';
import { PermissionEntity } from 'src/users/entity/permission.entity';

export class Roles1619957360686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const newPermissions = [];
    for (const permission of roleSeed) {
      const permissionsObj = await getRepository(PermissionEntity).find({
        id: Any(permission.permission),
      });
      newPermissions.push({ ...permission, permission: permissionsObj });
    }

    await getRepository(RoleEntity).save(newPermissions);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
