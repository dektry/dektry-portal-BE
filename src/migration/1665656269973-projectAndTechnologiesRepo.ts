import {MigrationInterface, QueryRunner} from "typeorm";

export class projectAndTechnologiesRepo1665656269973 implements MigrationInterface {
    name = 'projectAndTechnologiesRepo1665656269973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "technology" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_0e93116dd895bf20badb82d3ed6" UNIQUE ("name"), CONSTRAINT "PK_89f217a9ebf9b4bc1a0d74883ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "duration" character varying NOT NULL, "role" character varying NOT NULL, "team_size" character varying NOT NULL, "description" character varying NOT NULL, "responsibilities" text array NOT NULL, "employee" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "duration" character varying NOT NULL DEFAULT '', "role" character varying NOT NULL DEFAULT '', "team_size" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "responsibilities" text array NOT NULL, "employee" uuid, CONSTRAINT "PK_9cff9b5e447ee44263b23a04be0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "managers" uuid array NOT NULL, "users" uuid array NOT NULL, "isArchive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" TIMESTAMP WITH TIME ZONE NOT NULL, "to" TIMESTAMP WITH TIME ZONE, "userId" uuid, "projectId" uuid, CONSTRAINT "PK_d08088e76576fd3c27d4649ae7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_technologies_technology" ("projectId" uuid NOT NULL, "technologyId" uuid NOT NULL, CONSTRAINT "PK_13d3b19e83616b79587b14f4872" PRIMARY KEY ("projectId", "technologyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2e780097cfd60204dd415ed7cf" ON "project_technologies_technology" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c7d578080e24a8249d6754d67b" ON "project_technologies_technology" ("technologyId") `);
        await queryRunner.query(`CREATE TABLE "employee_projects_technologies_technology" ("employeeProjectsId" uuid NOT NULL, "technologyId" uuid NOT NULL, CONSTRAINT "PK_c834e49b780108ce13d748318af" PRIMARY KEY ("employeeProjectsId", "technologyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_00f6828aecbc13e5ca0f1e56e0" ON "employee_projects_technologies_technology" ("employeeProjectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9f8d9eb8c7f255f7661ee3e96" ON "employee_projects_technologies_technology" ("technologyId") `);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_74edad0b2911826795b3c30c8ad" FOREIGN KEY ("employee") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_projects" ADD CONSTRAINT "FK_17aa4ae3f6e8ee63240381cd878" FOREIGN KEY ("employee") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_history" ADD CONSTRAINT "FK_43107ec2445d18063ca4ad37db0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_history" ADD CONSTRAINT "FK_921bc60c72f95353a313e932340" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_technologies_technology" ADD CONSTRAINT "FK_2e780097cfd60204dd415ed7cfd" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_technologies_technology" ADD CONSTRAINT "FK_c7d578080e24a8249d6754d67b4" FOREIGN KEY ("technologyId") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_projects_technologies_technology" ADD CONSTRAINT "FK_00f6828aecbc13e5ca0f1e56e0f" FOREIGN KEY ("employeeProjectsId") REFERENCES "employee_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_projects_technologies_technology" ADD CONSTRAINT "FK_d9f8d9eb8c7f255f7661ee3e965" FOREIGN KEY ("technologyId") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_projects_technologies_technology" DROP CONSTRAINT "FK_d9f8d9eb8c7f255f7661ee3e965"`);
        await queryRunner.query(`ALTER TABLE "employee_projects_technologies_technology" DROP CONSTRAINT "FK_00f6828aecbc13e5ca0f1e56e0f"`);
        await queryRunner.query(`ALTER TABLE "project_technologies_technology" DROP CONSTRAINT "FK_c7d578080e24a8249d6754d67b4"`);
        await queryRunner.query(`ALTER TABLE "project_technologies_technology" DROP CONSTRAINT "FK_2e780097cfd60204dd415ed7cfd"`);
        await queryRunner.query(`ALTER TABLE "employee_projects" DROP CONSTRAINT "FK_17aa4ae3f6e8ee63240381cd878"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_74edad0b2911826795b3c30c8ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9f8d9eb8c7f255f7661ee3e96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00f6828aecbc13e5ca0f1e56e0"`);
        await queryRunner.query(`DROP TABLE "employee_projects_technologies_technology"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c7d578080e24a8249d6754d67b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e780097cfd60204dd415ed7cf"`);
        await queryRunner.query(`DROP TABLE "project_technologies_technology"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "employee_projects"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "technology"`);
    }

}
