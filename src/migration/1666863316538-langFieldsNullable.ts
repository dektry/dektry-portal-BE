import { MigrationInterface, QueryRunner } from 'typeorm';

export class langFieldsNullable1666863316538 implements MigrationInterface {
  name = 'langFieldsNullable1666863316538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(255) NOT NULL, "level" character varying(5) NOT NULL, CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "level"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "employee_id"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "value"`);
    await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "employee_id"`);
    await queryRunner.query(
      `ALTER TABLE "language" DROP CONSTRAINT "FK_86e3d2644703d9f89cc3db67aa9"`,
    );
  }
}
