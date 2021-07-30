import { Migration } from "@mikro-orm/migrations";

import { ns } from "../common/constants";

export class CreateUserTable1562222612033 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  async up(): Promise<void> {
    this.addSql(`
      create type ${ns}.user_role_enum as enum (
        'ADMIN',
        'USER'
      );
    `);

    this.addSql(`
      create type ${ns}.user_status_enum as enum (
        'ACTIVE',
        'INACTIVE',
        'PENDING'
      );
    `);

    this.addSql(
      `create table ${ns}.user (
      id serial primary key,
      first_name varchar not null,
      last_name varchar not null,
      email varchar not null,
      password varchar null,
      roles ${ns}.user_role_enum[] not null default '{USER}',
      status ${ns}.user_status_enum not null default 'PENDING',
      created_at timestamptz  not null default current_timestamp,
      updated_at timestamptz not null default now()
      );`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async down(): Promise<void> {
    this.addSql(`drop table ${ns}.user;`);
    this.addSql(`drop type ${ns}.user_role_enum;`);
    this.addSql(`drop type ${ns}.user_status_enum;`);
  }
}
