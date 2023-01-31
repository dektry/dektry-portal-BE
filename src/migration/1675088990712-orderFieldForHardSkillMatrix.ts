import {MigrationInterface, QueryRunner} from "typeorm";

export class orderFieldForHardSkillMatrix1675088990712 implements MigrationInterface {
    name = 'orderFieldForHardSkillMatrix1675088990712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "english_skill_group_id" TO "order"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "skillGroup" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "order" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "english_skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_fc77532c0d67712f9b54599ddea"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "skillGroup" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "order" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "skill_group_id" uuid`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "order" TO "english_skill_group_id"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_fc77532c0d67712f9b54599ddea" FOREIGN KEY ("english_skill_group_id") REFERENCES "englishSkillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
