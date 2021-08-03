import { Options, UnderscoreNamingStrategy } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import { UserEntity } from "./user/user.entity";
import { AuthEntity } from "./auth/auth.entity";
import { TokenEntity } from "./token/token.entity";
import { ns } from "./common/constants";

const config: Options = {
  type: "postgresql",
  entities: [UserEntity, AuthEntity, TokenEntity],
  baseDir: process.cwd(),
  namingStrategy: UnderscoreNamingStrategy,
  migrations: {
    tableName: ns,
    path: "./src/migrations",
    pattern: /^\d+-[\w-]+\.ts$/,
    transactional: true,
    allOrNothing: false,
  },
  debug: false,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
