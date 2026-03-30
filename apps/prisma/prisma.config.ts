import { resolve } from "node:path";

import { config } from "dotenv";
// eslint-disable-next-line
import { defineConfig } from "prisma/config";

config({
  path: resolve(process.cwd(), ".env"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: process.env.POSTGRES_URL!,
  },
});
