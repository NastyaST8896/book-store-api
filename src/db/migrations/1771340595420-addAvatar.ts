import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatar1771340595420 implements MigrationInterface {
    name = 'AddAvatar1771340595420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "avatar" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying NOT NULL, "uploadName" character varying NOT NULL, "filePath" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_50e36da9d45349941038eaf149d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "avatar"`);
    }

}
