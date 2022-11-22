import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEmployeeFields1666788968871 implements MigrationInterface {
  name = 'updateEmployeeFields1666788968871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "pfId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "yearsOfExperience" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "pfId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "yearsOfExperience"`,
    );
  }
}
