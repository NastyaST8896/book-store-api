import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaEntity1771418109550 implements MigrationInterface {
    name = 'AddMediaEntity1771418109550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying NOT NULL, "uploadName" character varying NOT NULL, "filePath" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mediaId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mediaId"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
