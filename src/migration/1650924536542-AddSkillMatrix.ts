import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSkillMatrix1650924536542 implements MigrationInterface {
    name = 'AddSkillMatrix1650924536542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skillGroup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "position_id" uuid, CONSTRAINT "PK_81992c33f4ea203cb5fa018d76a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "skill_id" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "skill_group_id" uuid, CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_levels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying NOT NULL DEFAULT '', "skill_id" uuid, "level_id" uuid, CONSTRAINT "PK_43af113b57d144742cb8b98fae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skillGroup" ADD CONSTRAINT "FK_0fce3379a23e1745a376abac5c5" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_1a5205a4af567a076844c652aa5" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_cd761945538a1551a43ab5d38b2" FOREIGN KEY ("skill_group_id") REFERENCES "skillGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill_levels" ADD CONSTRAINT "FK_b53231c54fb09845285865840f4" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill_levels" ADD CONSTRAINT "FK_84c9912be8c569195d2169505a4" FOREIGN KEY ("level_id") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_levels" DROP CONSTRAINT "FK_84c9912be8c569195d2169505a4"`);
        await queryRunner.query(`ALTER TABLE "skill_levels" DROP CONSTRAINT "FK_b53231c54fb09845285865840f4"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_cd761945538a1551a43ab5d38b2"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_1a5205a4af567a076844c652aa5"`);
        await queryRunner.query(`ALTER TABLE "skillGroup" DROP CONSTRAINT "FK_0fce3379a23e1745a376abac5c5"`);
        await queryRunner.query(`DROP TABLE "skill_levels"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "skillGroup"`);
    }

}
