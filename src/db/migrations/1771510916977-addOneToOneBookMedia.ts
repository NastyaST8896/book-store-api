import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOneToOneBookMedia1771510916977 implements MigrationInterface {
    name = 'AddOneToOneBookMedia1771510916977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "mediaId" uuid`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_97e612d2a14f2209b582c86250a" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_97e612d2a14f2209b582c86250a" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_97e612d2a14f2209b582c86250a"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_97e612d2a14f2209b582c86250a"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "mediaId"`);
    }

}
