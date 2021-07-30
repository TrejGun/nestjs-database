import { MigrationFn } from "umzug";
import { Sequelize, DataTypes } from "sequelize";

import { ns } from "../common/constants";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable(
    "auth",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT,
      },
      user_id: DataTypes.INTEGER,
      refresh_token: DataTypes.STRING,
      refresh_token_expires_at: DataTypes.BIGINT,
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      // @ts-ignore
      schema: ns,
    },
  );
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("auth");
};
