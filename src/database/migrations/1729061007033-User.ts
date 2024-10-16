import { MigrationInterface, QueryRunner } from "typeorm";

export class User1729061007033 implements MigrationInterface {
    name = 'User1729061007033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password_update_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password_update_at"`);
    }

}
