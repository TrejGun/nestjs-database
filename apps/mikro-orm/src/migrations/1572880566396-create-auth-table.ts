import { Migration } from "@mikro-orm/migrations";

import { ns } from "../common/constants";

export class CreateAuthTable1572880566396 extends Migration {
  // eslint-disable-next-line @typescript-eslint/require-await
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE ${ns}.auth (
        id serial not null,
        user_id int not null,
        refresh_token varchar not null,
        refresh_token_expires_at bigint not null,
        created_at timestamptz  not null default current_timestamp,
        updated_at timestamptz not null default now(),
        foreign key (user_id) references ${ns}.user (id) on delete cascade
      );`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async down(): Promise<void> {
    this.addSql(`drop table ${ns}.auth;`);
  }
}
