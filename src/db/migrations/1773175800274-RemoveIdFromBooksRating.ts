import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIdFromBooksRating1773175800274 implements MigrationInterface {
    name = 'RemoveIdFromBooksRating1773175800274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "PK_caed30804b2773d796fcc7ad1f1"`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "PK_4b21c9909785d9eb59f4b6e67b0" PRIMARY KEY ("userId", "bookId")`);
        await queryRunner.query(`ALTER TABLE "books_rating" DROP COLUMN "id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "PK_4b21c9909785d9eb59f4b6e67b0"`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "PK_caed30804b2773d796fcc7ad1f1" PRIMARY KEY ("id", "userId", "bookId")`);
    }

}
