import { MigrationFn } from "umzug";
import { Sequelize } from "sequelize";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.query(`-- do nothing`);
};
