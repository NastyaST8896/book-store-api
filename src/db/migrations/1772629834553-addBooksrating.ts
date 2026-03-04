import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBooksrating1772629834553 implements MigrationInterface {
    name = 'AddBooksrating1772629834553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "books_rating" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "userId" integer NOT NULL, "bookId" integer NOT NULL, "rating" double precision, CONSTRAINT "PK_d3fe65b4cb5121d8bcb886b45fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "FK_e183e272ec7c5cd48cd09768848" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "FK_85051608ff543aabf9c083b2590" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "FK_85051608ff543aabf9c083b2590"`);
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "FK_e183e272ec7c5cd48cd09768848"`);
        await queryRunner.query(`DROP TABLE "books_rating"`);
    }

}
