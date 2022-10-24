import {MigrationInterface, QueryRunner} from "typeorm";

export class educationTable1666591717939 implements MigrationInterface {
    name = 'educationTable1666591717939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_2e2a112e7de4ffcde1a85565ea4"`);
        await queryRunner.query(`CREATE TABLE "candidate_education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "school" character varying NOT NULL, "name" character varying NOT NULL, "from_year" integer, "to_year" integer, "subject" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "candidate" uuid, CONSTRAINT "UQ_6de6f7427531211803bfa4a1c9b" UNIQUE ("pfId"), CONSTRAINT "PK_86bda616ec3ad179c94236988fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "UQ_87ba7f2e2900bcbaa0d233d8cfa"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "pfId"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "from_year"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "to_year"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "candidate"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "school"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "formalEducation"`);
        await queryRunner.query(`ALTER TABLE "education" ADD "university" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "specialization" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "startYear" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "endYear" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "employee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "candidate_education" ADD CONSTRAINT "FK_eb4681c3974fcde249d302a000e" FOREIGN KEY ("candidate") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_fd8db9c406675aedca4b1f32dc1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_fd8db9c406675aedca4b1f32dc1"`);
        await queryRunner.query(`ALTER TABLE "candidate_education" DROP CONSTRAINT "FK_eb4681c3974fcde249d302a000e"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "endYear"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "startYear"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "specialization"`);
        await queryRunner.query(`ALTER TABLE "education" DROP COLUMN "university"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "formalEducation" json`);
        await queryRunner.query(`ALTER TABLE "education" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "education" ADD "subject" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "school" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD "candidate" uuid`);
        await queryRunner.query(`ALTER TABLE "education" ADD "to_year" integer`);
        await queryRunner.query(`ALTER TABLE "education" ADD "from_year" integer`);
        await queryRunner.query(`ALTER TABLE "education" ADD "pfId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "UQ_87ba7f2e2900bcbaa0d233d8cfa" UNIQUE ("pfId")`);
        await queryRunner.query(`DROP TABLE "candidate_education"`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_2e2a112e7de4ffcde1a85565ea4" FOREIGN KEY ("candidate") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
