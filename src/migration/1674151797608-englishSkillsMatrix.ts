import {MigrationInterface, QueryRunner} from "typeorm";

export class englishSkillsMatrix1674151797608 implements MigrationInterface {
    name = 'englishSkillsMatrix1674151797608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "skill_group_id" TO "english_skill_group_id"`);
        await queryRunner.query(`CREATE TABLE "englishSkillMatrix" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position_id" uuid, CONSTRAINT "REL_9a8871940b21a1b61ead206c11" UNIQUE ("position_id"), CONSTRAINT "PK_655b398746d3354fd801dee54f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "englishSkillGroup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "position_id" uuid, "english_skill_matrix_id" uuid, CONSTRAINT "PK_8db7b7114ac8b04db0fc6506c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "english_skill_levels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "description" character varying(512) NOT NULL DEFAULT '', "skill_id" uuid, "level_id" uuid, CONSTRAINT "PK_01cdcd6634f550f19ae98928c56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "english_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "english_skill_id" uuid, CONSTRAINT "PK_b897aea5fe5f52a27d51a4cfd8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "english_skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "englishSkillMatrix" ADD CONSTRAINT "FK_9a8871940b21a1b61ead206c110" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" ADD CONSTRAINT "FK_a44046c053baddb64423792e309" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" ADD CONSTRAINT "FK_094ad7b255dd0a7a56355d3bfc7" FOREIGN KEY ("english_skill_matrix_id") REFERENCES "englishSkillMatrix"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "english_skill_levels" ADD CONSTRAINT "FK_6cd85fe5f92e161894bbd64eeb7" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "english_skill_levels" ADD CONSTRAINT "FK_a132cdda36af3fc3f4dcfd634f8" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "english_question" ADD CONSTRAINT "FK_2e5fa2384d0f3a34a5a1ea7681d" FOREIGN KEY ("english_skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "english_question" DROP CONSTRAINT "FK_2e5fa2384d0f3a34a5a1ea7681d"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`);
        await queryRunner.query(`ALTER TABLE "english_skill_levels" DROP CONSTRAINT "FK_a132cdda36af3fc3f4dcfd634f8"`);
        await queryRunner.query(`ALTER TABLE "english_skill_levels" DROP CONSTRAINT "FK_6cd85fe5f92e161894bbd64eeb7"`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" DROP CONSTRAINT "FK_094ad7b255dd0a7a56355d3bfc7"`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" DROP CONSTRAINT "FK_a44046c053baddb64423792e309"`);
        await queryRunner.query(`ALTER TABLE "englishSkillMatrix" DROP CONSTRAINT "FK_9a8871940b21a1b61ead206c110"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "english_skill_group_id" uuid`);
        await queryRunner.query(`DROP TABLE "english_question"`);
        await queryRunner.query(`DROP TABLE "english_skill_levels"`);
        await queryRunner.query(`DROP TABLE "englishSkillGroup"`);
        await queryRunner.query(`DROP TABLE "englishSkillMatrix"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "english_skill_group_id" TO "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
