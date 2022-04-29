import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmployee1651238454372 implements MigrationInterface {
    name = 'AddEmployee1651238454372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "pfUpdatedAt" character varying, "fullName" character varying(255), "position" character varying(255), "level" character varying(255), "location" character varying(255), "timezone" character varying(40), "languages" json, "formalEducation" json, "startingPoint" TIMESTAMP, "interests" json, CONSTRAINT "UQ_ff323467973d5dbb27f2b763a2f" UNIQUE ("pfId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
