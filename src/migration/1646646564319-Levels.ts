import { MigrationInterface, QueryRunner } from 'typeorm';

export class Levels1646646564319 implements MigrationInterface {
  name = 'Levels1646646564319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vacations" DROP CONSTRAINT "FK_89640b2dfe9d14d229c6943626f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" DROP CONSTRAINT "FK_921bc60c72f95353a313e932340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" DROP CONSTRAINT "FK_43107ec2445d18063ca4ad37db0"`,
    );
    await queryRunner.query(
      `CREATE TABLE "careersLevels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_0a036f534e81ef8a6c7f56144b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "careers" ADD "levelId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "careers" ADD CONSTRAINT "FK_4165561e4558053c795a34881d9" FOREIGN KEY ("levelId") REFERENCES "careersLevels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "level_positions" ("positionsId" uuid NOT NULL, "careersLevelsId" uuid NOT NULL, CONSTRAINT "PK_a033cf9bc241470374e1d8c8431" PRIMARY KEY ("positionsId", "careersLevelsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30dae43538ad0296038f490f5d" ON "level_positions" ("positionsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6a5586d5d2c4abd945a6914b85" ON "level_positions" ("careersLevelsId") `,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "level" uuid`);
    await queryRunner.query(
      `ALTER TABLE "vacations" ADD CONSTRAINT "FK_89640b2dfe9d14d229c6943626f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_49c5b098acf02a13f88d2017b05" FOREIGN KEY ("level") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" ADD CONSTRAINT "FK_43107ec2445d18063ca4ad37db0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" ADD CONSTRAINT "FK_921bc60c72f95353a313e932340" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "level_positions" ADD CONSTRAINT "FK_30dae43538ad0296038f490f5d8" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "level_positions" ADD CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f" FOREIGN KEY ("careersLevelsId") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "level_positions" DROP CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "level_positions" DROP CONSTRAINT "FK_30dae43538ad0296038f490f5d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "careers" DROP CONSTRAINT "FK_4165561e4558053c795a34881d9"`,
    );
    await queryRunner.query(`ALTER TABLE "careers" DROP COLUMN "levelId"`);
    await queryRunner.query(
      `ALTER TABLE "projects_history" DROP CONSTRAINT "FK_921bc60c72f95353a313e932340"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" DROP CONSTRAINT "FK_43107ec2445d18063ca4ad37db0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_49c5b098acf02a13f88d2017b05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacations" DROP CONSTRAINT "FK_89640b2dfe9d14d229c6943626f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level"`);
    await queryRunner.query(`DROP INDEX "IDX_6a5586d5d2c4abd945a6914b85"`);
    await queryRunner.query(`DROP INDEX "IDX_30dae43538ad0296038f490f5d"`);
    await queryRunner.query(`DROP TABLE "level_positions"`);
    await queryRunner.query(`DROP TABLE "careersLevels"`);
    await queryRunner.query(
      `ALTER TABLE "projects_history" ADD CONSTRAINT "FK_43107ec2445d18063ca4ad37db0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_history" ADD CONSTRAINT "FK_921bc60c72f95353a313e932340" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_ace513fa30d485cfd25c11a9e4a" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacations" ADD CONSTRAINT "FK_89640b2dfe9d14d229c6943626f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
