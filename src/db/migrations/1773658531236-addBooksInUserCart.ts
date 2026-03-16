import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBooksInUserCart1773658531236 implements MigrationInterface {
    name = 'AddBooksInUserCart1773658531236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "books_in_user_cart" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "bookId" integer NOT NULL, "currentPrice" numeric(10,2) NOT NULL, CONSTRAINT "PK_76b1068379ac842cc8572d00624" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "books_rating" ADD CONSTRAINT "PK_4b21c9909785d9eb59f4b6e67b0" PRIMARY KEY ("userId", "bookId")`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" ADD CONSTRAINT "FK_caefc6f57fbf8afae4dd78affc4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" ADD CONSTRAINT "FK_f997b6b45bba75ef7e4d1d3c424" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" DROP CONSTRAINT "FK_f997b6b45bba75ef7e4d1d3c424"`);
        await queryRunner.query(`ALTER TABLE "books_in_user_cart" DROP CONSTRAINT "FK_caefc6f57fbf8afae4dd78affc4"`);
        await queryRunner.query(`ALTER TABLE "books_rating" DROP CONSTRAINT "PK_4b21c9909785d9eb59f4b6e67b0"`);
        await queryRunner.query(`DROP TABLE "books_in_user_cart"`);
    }

}
