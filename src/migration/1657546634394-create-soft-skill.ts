import {MigrationInterface, QueryRunner} from "typeorm";

export class createSoftSkill1657546634394 implements MigrationInterface {
    name = 'createSoftSkill1657546634394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "soft_skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_3aecca2c1928308ae2c49e1927e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "soft_skill"`);
    }

}
