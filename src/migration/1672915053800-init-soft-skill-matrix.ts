import {MigrationInterface, QueryRunner} from "typeorm";

export class initSoftSkillMatrix1672915053800 implements MigrationInterface {
    name = 'initSoftSkillMatrix1672915053800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "soft_skill_levels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "description" character varying(512) NOT NULL DEFAULT '', "skill_id" uuid, "level_id" uuid, CONSTRAINT "PK_2a944fd9f6574ead830fffeee8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "softSkillMatrix" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position_id" uuid, CONSTRAINT "REL_1f8e6da8dee683a21cc6b82c64" UNIQUE ("position_id"), CONSTRAINT "PK_29c534c62361b88c974c4aeb9ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "question"`);
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "hintText"`);
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD "soft_skill_matrix_id" uuid`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" ADD CONSTRAINT "FK_78d0cdac72f30c7947b396c8e03" FOREIGN KEY ("skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" ADD CONSTRAINT "FK_1a3d86d1dffd23f846ab6b79fe3" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "softSkillMatrix" ADD CONSTRAINT "FK_1f8e6da8dee683a21cc6b82c649" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD CONSTRAINT "FK_bdd89a3c691fbe0a0e4be7976fc" FOREIGN KEY ("soft_skill_matrix_id") REFERENCES "softSkillMatrix"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP CONSTRAINT "FK_bdd89a3c691fbe0a0e4be7976fc"`);
        await queryRunner.query(`ALTER TABLE "softSkillMatrix" DROP CONSTRAINT "FK_1f8e6da8dee683a21cc6b82c649"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" DROP CONSTRAINT "FK_1a3d86d1dffd23f846ab6b79fe3"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_levels" DROP CONSTRAINT "FK_78d0cdac72f30c7947b396c8e03"`);
        await queryRunner.query(`ALTER TABLE "soft_skill" DROP COLUMN "soft_skill_matrix_id"`);
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD "hintText" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "soft_skill" ADD "question" character varying(512) NOT NULL DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "softSkillMatrix"`);
        await queryRunner.query(`DROP TABLE "soft_skill_levels"`);
    }

}
