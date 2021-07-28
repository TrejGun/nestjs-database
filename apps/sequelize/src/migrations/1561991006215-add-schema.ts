import { MigrationFn } from "umzug";
import { Sequelize } from "sequelize";

import { ns } from "../common/constants";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createSchema(ns);
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropSchema(ns);
};
