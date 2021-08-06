import {MigrationInterface, QueryRunner} from "typeorm";

export class onBoardingTemplates1628274463068 implements MigrationInterface {
    name = 'onBoardingTemplates1628274463068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_8a974ab8bdb6b87311cd79cb8b3" UNIQUE ("name"), CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingTasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_935a7b7f06c97230a429347fa1f" UNIQUE ("title"), CONSTRAINT "PK_af44ef78b3e382a507c7e657b6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingOrderedTasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "index" integer NOT NULL, "taskId" uuid, "templateId" uuid, CONSTRAINT "PK_4e1fde28af3827c07f6baa68c16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingTemplates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "targetId" uuid, "groupId" uuid, CONSTRAINT "UQ_7c0e2c1c622835c05afbcc071bf" UNIQUE ("name"), CONSTRAINT "PK_44efc448ed9969b66c83ed8a38e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoardingGroups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_71800d152fc78a075f121c1e7f9" UNIQUE ("name"), CONSTRAINT "PK_a9f4b8f7efdf1be0424cf63e53d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "onBoarding_templates_write" ("onBoardingTemplatesId" uuid NOT NULL, "positionGroupId" uuid NOT NULL, CONSTRAINT "PK_456cfab683d88015153f4bcf42c" PRIMARY KEY ("onBoardingTemplatesId", "positionGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc2733d5664df5872d7492b6d4" ON "onBoarding_templates_write" ("onBoardingTemplatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1fbe17811a587f99ba1623b9a" ON "onBoarding_templates_write" ("positionGroupId") `);
        await queryRunner.query(`CREATE TABLE "onBoarding_templates_read" ("onBoardingTemplatesId" uuid NOT NULL, "positionGroupId" uuid NOT NULL, CONSTRAINT "PK_9325e86230e4d10560460348a8b" PRIMARY KEY ("onBoardingTemplatesId", "positionGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b504831eb92c7d54eded52eadb" ON "onBoarding_templates_read" ("onBoardingTemplatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_33913debccee6072cb177c0953" ON "onBoarding_templates_read" ("positionGroupId") `);
        await queryRunner.query(`ALTER TABLE "positionGroup" ADD "accessId" uuid`);
        await queryRunner.query(`ALTER TABLE "positions" ADD "accessId" uuid`);
        await queryRunner.query(`ALTER TABLE "positionGroup" ADD CONSTRAINT "FK_975b9160536723e409e6acd44ca" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions" ADD CONSTRAINT "FK_a4edd0887ce57867532f5c2914a" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoardingOrderedTasks" ADD CONSTRAINT "FK_4310edff4629e930e2f8c6a9529" FOREIGN KEY ("taskId") REFERENCES "onBoardingTasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoardingOrderedTasks" ADD CONSTRAINT "FK_21b7706205aadede89728de1e78" FOREIGN KEY ("templateId") REFERENCES "onBoardingTemplates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" ADD CONSTRAINT "FK_814225ea7d2538aa20a8ab39208" FOREIGN KEY ("targetId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" ADD CONSTRAINT "FK_93c7ab1926258231b4d58234ca5" FOREIGN KEY ("groupId") REFERENCES "onBoardingGroups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_b1fbe17811a587f99ba1623b9ad" FOREIGN KEY ("positionGroupId") REFERENCES "positionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_33913debccee6072cb177c09537" FOREIGN KEY ("positionGroupId") REFERENCES "positionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_33913debccee6072cb177c09537"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_b1fbe17811a587f99ba1623b9ad"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" DROP CONSTRAINT "FK_93c7ab1926258231b4d58234ca5"`);
        await queryRunner.query(`ALTER TABLE "onBoardingTemplates" DROP CONSTRAINT "FK_814225ea7d2538aa20a8ab39208"`);
        await queryRunner.query(`ALTER TABLE "onBoardingOrderedTasks" DROP CONSTRAINT "FK_21b7706205aadede89728de1e78"`);
        await queryRunner.query(`ALTER TABLE "onBoardingOrderedTasks" DROP CONSTRAINT "FK_4310edff4629e930e2f8c6a9529"`);
        await queryRunner.query(`ALTER TABLE "positions" DROP CONSTRAINT "FK_a4edd0887ce57867532f5c2914a"`);
        await queryRunner.query(`ALTER TABLE "positionGroup" DROP CONSTRAINT "FK_975b9160536723e409e6acd44ca"`);
        await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN "accessId"`);
        await queryRunner.query(`ALTER TABLE "positionGroup" DROP COLUMN "accessId"`);
        await queryRunner.query(`DROP INDEX "IDX_33913debccee6072cb177c0953"`);
        await queryRunner.query(`DROP INDEX "IDX_b504831eb92c7d54eded52eadb"`);
        await queryRunner.query(`DROP TABLE "onBoarding_templates_read"`);
        await queryRunner.query(`DROP INDEX "IDX_b1fbe17811a587f99ba1623b9a"`);
        await queryRunner.query(`DROP INDEX "IDX_cc2733d5664df5872d7492b6d4"`);
        await queryRunner.query(`DROP TABLE "onBoarding_templates_write"`);
        await queryRunner.query(`DROP TABLE "onBoardingGroups"`);
        await queryRunner.query(`DROP TABLE "onBoardingTemplates"`);
        await queryRunner.query(`DROP TABLE "onBoardingOrderedTasks"`);
        await queryRunner.query(`DROP TABLE "onBoardingTasks"`);
        await queryRunner.query(`DROP TABLE "access"`);
    }

}
