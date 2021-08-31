import {MigrationInterface, QueryRunner} from "typeorm";

export class Projects1628509994086 implements MigrationInterface {
    name = 'Projects1628509994086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "managers" uuid array NOT NULL, "users" uuid array NOT NULL, "isArchive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" TIMESTAMP WITH TIME ZONE NOT NULL, "to" TIMESTAMP WITH TIME ZONE, "userId" uuid, "projectId" uuid, CONSTRAINT "PK_d08088e76576fd3c27d4649ae7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects_history" ADD CONSTRAINT "FK_43107ec2445d18063ca4ad37db0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_history" ADD CONSTRAINT "FK_921bc60c72f95353a313e932340" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_history" DROP CONSTRAINT "FK_921bc60c72f95353a313e932340"`);
        await queryRunner.query(`ALTER TABLE "projects_history" DROP CONSTRAINT "FK_43107ec2445d18063ca4ad37db0"`);
        await queryRunner.query(`DROP TABLE "projects_history"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
