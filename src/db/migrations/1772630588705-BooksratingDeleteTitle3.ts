import { MigrationInterface, QueryRunner } from "typeorm";

export class BooksratingDeleteTitle31772630588705 implements MigrationInterface {
    name = 'BooksratingDeleteTitle31772630588705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "book" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD "title" character varying NOT NULL`);
    }

}
