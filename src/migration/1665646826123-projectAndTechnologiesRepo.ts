import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectAndTechnologiesRepo1665646826123
  implements MigrationInterface
{
  name = 'projectAndTechnologiesRepo1665646826123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_46800813f460eb131823371caee" UNIQUE ("name"), CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "duration" character varying NOT NULL DEFAULT '', "role" character varying NOT NULL DEFAULT '', "team_size" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "responsibilities" text array NOT NULL, "employee" uuid, CONSTRAINT "PK_9cff9b5e447ee44263b23a04be0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technologies_projects_employee_projects" ("technologiesId" uuid NOT NULL, "employeeProjectsId" uuid NOT NULL, CONSTRAINT "PK_fa1b426a41359decce0845cf097" PRIMARY KEY ("technologiesId", "employeeProjectsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dba9d1e67f0607bdc90598a76c" ON "technologies_projects_employee_projects" ("technologiesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46b629f8e47118f2bd3df326b9" ON "technologies_projects_employee_projects" ("employeeProjectsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_projects_technologies_technologies" ("employeeProjectsId" uuid NOT NULL, "technologiesId" uuid NOT NULL, CONSTRAINT "PK_32d42c4088f7778a826b1cd9475" PRIMARY KEY ("employeeProjectsId", "technologiesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b63edcdd77250e4dd0f082d5d" ON "employee_projects_technologies_technologies" ("employeeProjectsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28acfab17ea0ab44d586efef70" ON "employee_projects_technologies_technologies" ("technologiesId") `,
    );

    await queryRunner.query(
      `ALTER TABLE "employee_projects" ADD CONSTRAINT "FK_17aa4ae3f6e8ee63240381cd878" FOREIGN KEY ("employee") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "technologies_projects_employee_projects" ADD CONSTRAINT "FK_dba9d1e67f0607bdc90598a76ce" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "technologies_projects_employee_projects" ADD CONSTRAINT "FK_46b629f8e47118f2bd3df326b97" FOREIGN KEY ("employeeProjectsId") REFERENCES "employee_projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_projects_technologies_technologies" ADD CONSTRAINT "FK_7b63edcdd77250e4dd0f082d5d9" FOREIGN KEY ("employeeProjectsId") REFERENCES "employee_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_projects_technologies_technologies" ADD CONSTRAINT "FK_28acfab17ea0ab44d586efef705" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee_projects_technologies_technologies" DROP CONSTRAINT "FK_28acfab17ea0ab44d586efef705"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee_projects_technologies_technologies" DROP CONSTRAINT "FK_7b63edcdd77250e4dd0f082d5d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technologies_projects_employee_projects" DROP CONSTRAINT "FK_46b629f8e47118f2bd3df326b97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technologies_projects_employee_projects" DROP CONSTRAINT "FK_dba9d1e67f0607bdc90598a76ce"`,
    );

    await queryRunner.query(
      `ALTER TABLE "employee_projects" DROP CONSTRAINT "FK_17aa4ae3f6e8ee63240381cd878"`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_28acfab17ea0ab44d586efef70"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7b63edcdd77250e4dd0f082d5d"`,
    );
    await queryRunner.query(
      `DROP TABLE "employee_projects_technologies_technologies"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_46b629f8e47118f2bd3df326b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dba9d1e67f0607bdc90598a76c"`,
    );
    await queryRunner.query(
      `DROP TABLE "technologies_projects_employee_projects"`,
    );
    await queryRunner.query(`DROP TABLE "employee_projects"`);
    await queryRunner.query(`DROP TABLE "technologies"`);
  }
}
