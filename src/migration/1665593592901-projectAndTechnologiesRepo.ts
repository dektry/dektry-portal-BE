import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectAndTechnologiesRepo1665593592901
  implements MigrationInterface
{
  name = 'projectAndTechnologiesRepo1665593592901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "duration" character varying NOT NULL DEFAULT '', "role" character varying NOT NULL DEFAULT '', "team_size" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "responsibilities" text array NOT NULL, "employee_id" uuid, CONSTRAINT "PK_9cff9b5e447ee44263b23a04be0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_projects" ADD CONSTRAINT "FK_77c7f378f40dd99d1ce2b953d3d" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_projects" DROP CONSTRAINT "FK_77c7f378f40dd99d1ce2b953d3d"`,
    );
    await queryRunner.query(`DROP TABLE "employee_projects"`);
    await queryRunner.query(`DROP TABLE "technologies"`);
  }
}
