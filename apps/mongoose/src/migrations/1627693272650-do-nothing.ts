import { MigrationFn } from "umzug";
import { Connection } from "mongoose";

export const up: MigrationFn<Connection> = async ({ context: connection }) => {
  await Promise.resolve(connection);
};

export const down: MigrationFn<Connection> = async ({ context: connection }) => {
  await Promise.resolve(connection);
};
