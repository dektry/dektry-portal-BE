import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateEmployeeInterviewTable1671628246590
  implements MigrationInterface
{
  name = 'updateEmployeeInterviewTable1671628246590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_interview" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" DROP COLUMN "isApproved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" ADD "type" character varying(32) NOT NULL DEFAULT 'Assessment'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_interview" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" DROP COLUMN "updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" DROP COLUMN "created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" ADD "isApproved" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_interview" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }
}
