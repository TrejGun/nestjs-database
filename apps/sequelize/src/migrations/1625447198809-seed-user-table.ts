import { MigrationFn } from "umzug";
import { Sequelize } from "sequelize";

import { ns } from "../common/constants";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert(
    {
      schema: ns,
      tableName: "user",
    },
    [
      {
        first_name: "Trej",
        last_name: "Gun",
        email: "trejgun@gmail.com",
        password: "yourpasswordehre",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  );
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete(
    {
      schema: ns,
      tableName: "user",
    },
    {},
    {
      // @ts-ignore
      truncate: true,
      restartIdentity: true,
      cascade: true,
    },
  );
};
