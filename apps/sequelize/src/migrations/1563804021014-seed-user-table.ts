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
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
        roles: "{USER}",
        status: "ACTIVE",
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
