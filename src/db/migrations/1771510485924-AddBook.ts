import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBook1771510485924 implements MigrationInterface {
    name = 'AddBook1771510485924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "release_date" date NOT NULL, "genre" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "rating" double precision, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
