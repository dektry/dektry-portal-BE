import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCandidates1649260440434 implements MigrationInterface {
    name = 'AddCandidates1649260440434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_79480f874d3ab95574b02d449fa"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_7546587c0a633e531d68a08f5f0"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_32784ed06174605483e71c99049"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0"`);
        await queryRunner.query(`ALTER TABLE "level_positions" DROP CONSTRAINT "FK_30dae43538ad0296038f490f5d8"`);
        await queryRunner.query(`ALTER TABLE "level_positions" DROP CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`CREATE TABLE "education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "school" character varying NOT NULL, "name" character varying NOT NULL, "from_year" integer, "to_year" integer, "subject" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "candidate" uuid, CONSTRAINT "UQ_87ba7f2e2900bcbaa0d233d8cfa" UNIQUE ("pfId"), CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "code" character varying(40) NOT NULL, "level" character varying(40) NOT NULL, CONSTRAINT "UQ_7032779f9862923a1f4f315b726" UNIQUE ("level", "code"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_465b3173cdddf0ac2d3fe73a33" ON "language" ("code") `);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "pfUpdatedAt" character varying, "fullName" character varying(255), "position" character varying(255), "level" character varying(40), "location" character varying(255), "timezone" character varying(40), CONSTRAINT "UQ_c26b5fd50d17ccea9ada0e415f9" UNIQUE ("pfId"), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pfId" integer NOT NULL, "title" character varying NOT NULL, "company" character varying NOT NULL, "starts_on" TIMESTAMP NOT NULL, "ends_on" TIMESTAMP, "location" character varying, "description" character varying NOT NULL DEFAULT '', "candidate" uuid, CONSTRAINT "UQ_916c6a039ed1dfcb5d961dbea21" UNIQUE ("pfId"), CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate_language" ("candidateId" uuid NOT NULL, "languageId" uuid NOT NULL, CONSTRAINT "PK_7fc9d3496505b4626dc16989530" PRIMARY KEY ("candidateId", "languageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_02375f084ac86684735249c3be" ON "candidate_language" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6119545076df5a8f1d0f73e30e" ON "candidate_language" ("languageId") `);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_2e2a112e7de4ffcde1a85565ea4" FOREIGN KEY ("candidate") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_9de6cf0ead8ca341c830812b53b" FOREIGN KEY ("candidate") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_79480f874d3ab95574b02d449fa" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_7546587c0a633e531d68a08f5f0" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_32784ed06174605483e71c99049" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "level_positions" ADD CONSTRAINT "FK_30dae43538ad0296038f490f5d8" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "level_positions" ADD CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f" FOREIGN KEY ("careersLevelsId") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "candidate_language" ADD CONSTRAINT "FK_02375f084ac86684735249c3be7" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "candidate_language" ADD CONSTRAINT "FK_6119545076df5a8f1d0f73e30e1" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_d422dabc78ff74a8dab6583da02"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c"`);
        await queryRunner.query(`ALTER TABLE "candidate_language" DROP CONSTRAINT "FK_6119545076df5a8f1d0f73e30e1"`);
        await queryRunner.query(`ALTER TABLE "candidate_language" DROP CONSTRAINT "FK_02375f084ac86684735249c3be7"`);
        await queryRunner.query(`ALTER TABLE "level_positions" DROP CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f"`);
        await queryRunner.query(`ALTER TABLE "level_positions" DROP CONSTRAINT "FK_30dae43538ad0296038f490f5d8"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0"`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" DROP CONSTRAINT "FK_32784ed06174605483e71c99049"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274"`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" DROP CONSTRAINT "FK_7546587c0a633e531d68a08f5f0"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0"`);
        await queryRunner.query(`ALTER TABLE "positions_access" DROP CONSTRAINT "FK_79480f874d3ab95574b02d449fa"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" DROP CONSTRAINT "FK_b504831eb92c7d54eded52eadba"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5"`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" DROP CONSTRAINT "FK_cc2733d5664df5872d7492b6d41"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_9de6cf0ead8ca341c830812b53b"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_2e2a112e7de4ffcde1a85565ea4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6119545076df5a8f1d0f73e30e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_02375f084ac86684735249c3be"`);
        await queryRunner.query(`DROP TABLE "candidate_language"`);
        await queryRunner.query(`DROP TABLE "experience"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_465b3173cdddf0ac2d3fe73a33"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_d422dabc78ff74a8dab6583da02" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_0cb93c5877d37e954e2aa59e52c" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "level_positions" ADD CONSTRAINT "FK_6a5586d5d2c4abd945a6914b85f" FOREIGN KEY ("careersLevelsId") REFERENCES "careersLevels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "level_positions" ADD CONSTRAINT "FK_30dae43538ad0296038f490f5d8" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_e85306b9ca78bf537cfb2dba8e0" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_read_positions" ADD CONSTRAINT "FK_32784ed06174605483e71c99049" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_fd74c51b4c5a44664de35bc6274" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_edit_positions" ADD CONSTRAINT "FK_7546587c0a633e531d68a08f5f0" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_84a995ca380d8a4f3c8e7d40fa0" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "positions_access" ADD CONSTRAINT "FK_79480f874d3ab95574b02d449fa" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_84588fd7ba5e1dd0564915dc951" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_read" ADD CONSTRAINT "FK_b504831eb92c7d54eded52eadba" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_856a614d3d7ea0ec71d1c05e6d5" FOREIGN KEY ("positionsId") REFERENCES "positions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onBoarding_templates_write" ADD CONSTRAINT "FK_cc2733d5664df5872d7492b6d41" FOREIGN KEY ("onBoardingTemplatesId") REFERENCES "onBoardingTemplates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
