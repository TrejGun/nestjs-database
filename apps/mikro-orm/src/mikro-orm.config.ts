import {Options, UnderscoreNamingStrategy} from "@mikro-orm/core";
import {SqlHighlighter} from "@mikro-orm/sql-highlighter";
import {TsMorphMetadataProvider} from "@mikro-orm/reflection";
import {Migration20210720063728} from "./migrations/Migration20210720063728";
import {UserEntity} from "./user/user.entity";
import {AuthEntity} from "./auth/auth.entity";

const config: Options = {
  type: "postgresql",
  clientUrl: process.env.POSTGRES_URL,
  // entities: ["dist/**/*.entity.js"],
  entities: [UserEntity, AuthEntity],
  baseDir: process.cwd(),
  namingStrategy: UnderscoreNamingStrategy,
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: "./src/migrations", // path to the folder with migrations
    // pattern: /^[\w-]+\d+\.ts$/, // regex pattern for the migration files
    // transactional: true, // wrap each migration in a transaction
    // disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    // allOrNothing: true, // wrap all migrations in master transaction
    // dropTables: true, // allow to disable table dropping
    // safe: false, // allow to disable table and column dropping
    // emit: "ts", // migration generation mode
    migrationsList: [
      {
        name: "Migration20210720063728.ts",
        class: Migration20210720063728,
      },
    ],
  },
  debug: true,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
