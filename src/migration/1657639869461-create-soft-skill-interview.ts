import {MigrationInterface, QueryRunner} from "typeorm";

export class createSoftSkillInterview1657639869461 implements MigrationInterface {
    name = 'createSoftSkillInterview1657639869461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "soft_interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "hobby" character varying(512), "comment" character varying(512), "candidate_id" uuid, CONSTRAINT "REL_a137161ef9bd0571eceb6c32b2" UNIQUE ("candidate_id"), CONSTRAINT "PK_c2e22a1a4ec62d1cd39fb90d279" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "soft_skill_to_interview" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "soft_skill_id" uuid, "soft_interview_id" uuid, CONSTRAINT "PK_f854242abbf3254409de216243b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soft_interview" ADD CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" ADD CONSTRAINT "FK_ab2d9a865c0fe1384638a871ee6" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" ADD CONSTRAINT "FK_6e5ac735c0b6af1f7182484d432" FOREIGN KEY ("soft_interview_id") REFERENCES "soft_interview"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" DROP CONSTRAINT "FK_6e5ac735c0b6af1f7182484d432"`);
        await queryRunner.query(`ALTER TABLE "soft_skill_to_interview" DROP CONSTRAINT "FK_ab2d9a865c0fe1384638a871ee6"`);
        await queryRunner.query(`ALTER TABLE "soft_interview" DROP CONSTRAINT "FK_a137161ef9bd0571eceb6c32b2c"`);
        await queryRunner.query(`DROP TABLE "soft_skill_to_interview"`);
        await queryRunner.query(`DROP TABLE "soft_interview"`);
    }

}
