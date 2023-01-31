import {MigrationInterface, QueryRunner} from "typeorm";

export class orderFieldForSoftAndEnglishSkillMatrix1675104207652 implements MigrationInterface {
    name = 'orderFieldForSoftAndEnglishSkillMatrix1675104207652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "english_question" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "english_skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "english_question" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "englishSkillGroup" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "english_skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
