import { MigrationInterface, QueryRunner } from "typeorm";

export class BooksratingDeleteTitle1772629950314 implements MigrationInterface {
    name = 'BooksratingDeleteTitle1772629950314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "title" character varying NOT NULL`);
    }

}
