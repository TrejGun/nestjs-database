import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { defineConfig, Options } from "@mikro-orm/postgresql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Migrator } from "@mikro-orm/migrations";

import { UserEntity } from "./user/user.entity";
import { AuthEntity } from "./auth/auth.entity";
import { TokenEntity } from "./token/token.entity";
import { ns } from "./common/constants";

const config: Options = defineConfig({
  extensions: [Migrator],
  dbName: "development",
  entities: [UserEntity, AuthEntity, TokenEntity],
  baseDir: process.cwd(),
  namingStrategy: UnderscoreNamingStrategy,
  migrations: {
    tableName: ns,
    path: "./src/migrations",
    glob: "!(*.d).{js,ts}",
    transactional: true,
    allOrNothing: false,
  },
  debug: false,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
});

export default config;
