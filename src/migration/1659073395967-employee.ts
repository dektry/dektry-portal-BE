import { MigrationInterface, QueryRunner } from 'typeorm';

export class employee1659073395967 implements MigrationInterface {
  name = 'employee1659073395967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "personalEmail" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "mobileNumber" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "dateOfBirth" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "gender" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "avatarUrl" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "hiredOn" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "skypeUsername" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "slackUsername" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "twitterUsername" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "facebookUrl" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "linkedinUrl" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "division" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "employee" ADD "department" json`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "avatarUrl" character varying(1000)`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "avatarUrl" character varying(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "division"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "linkedinUrl"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "facebookUrl"`);
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "twitterUsername"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "slackUsername"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "skypeUsername"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "hiredOn"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "mobileNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP COLUMN "personalEmail"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "department"`);
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "avatarUrl" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "avatarUrl" character varying(255)`,
    );
  }
}
