import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "../common/constants";

export class CreateUserTable1562222612033 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("test.user");
    await queryRunner.query("DROP TYPE test.user_role_enum;");
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.user_role_enum AS ENUM (
        'ADMIN',
        'USER'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.user_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'PENDING'
      );
    `);

    const table = new Table({
      name: "test.user",
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "email",
          type: "varchar",
        },
        {
          name: "password",
          type: "varchar",
        },
        {
          name: "roles",
          type: `${ns}.user_role_enum`,
          isArray: true,
        },
        {
          name: "type",
          type: `${ns}.user_type_enum`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }
}
