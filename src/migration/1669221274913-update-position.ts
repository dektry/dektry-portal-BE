import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePosition1669221274913 implements MigrationInterface {
  name = 'updatePosition1669221274913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "positionGroup" CASCADE`);
    await queryRunner.query(
      `ALTER TABLE "positions" DROP COLUMN "salaryMaxLimit"`,
    );
    await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "groupId"`);
    await queryRunner.query(
      `ALTER TABLE "positions" DROP COLUMN "salaryMinLimit"`,
    );
    await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "duties"`);
    await queryRunner.query(
      `ALTER TABLE "positions" DROP COLUMN "requirements"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "positions" ADD "requirements" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "positions" ADD "duties" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "positions" ADD "salaryMinLimit" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "positions" ADD "salaryMaxLimit" integer NOT NULL`,
    );
  }
}
