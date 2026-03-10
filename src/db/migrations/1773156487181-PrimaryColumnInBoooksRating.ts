import { MigrationInterface, QueryRunner } from "typeorm";

export class PrimaryColumnInBoooksRating1773156487181 implements MigrationInterface {
    name = 'PrimaryColumnInBoooksRating1773156487181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "PK_d3fe65b4cb5121d8bcb886b45fb"`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "PK_caed30804b2773d796fcc7ad1f1" PRIMARY KEY ("id", "userId", "bookId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "PK_caed30804b2773d796fcc7ad1f1"`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "PK_d3fe65b4cb5121d8bcb886b45fb" PRIMARY KEY ("id")`);
    }

}
