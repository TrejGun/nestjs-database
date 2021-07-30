import { MigrationFn } from "umzug";
import { Sequelize, DataTypes } from "sequelize";

import { ns } from "../common/constants";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.query(`
      CREATE TYPE ${ns}.enum_user_roles AS ENUM (
        'ADMIN',
        'USER'
      );
    `);

  await sequelize.getQueryInterface().createTable(
    "user",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM({
          values: ["ACTIVE", "INACTIVE", "PENDING"],
        }),
        defaultValue: "PENDING",
      },
      // roles: {
      //   type: DataTypes.ARRAY(
      //     DataTypes.ENUM({
      //       values: Object.values(UserRole),
      //     }),
      //   ),
      //   defaultValue: [UserRole.USER],
      // },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    {
      // @ts-ignore
      schema: ns,
    },
  );

  // Working around https://github.com/sequelize/sequelize/issues/11285
  await sequelize.query(`alter table ${ns}.user add column roles ${ns}.enum_user_roles[] not null default '{USER}';`);
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("user", {
    // @ts-ignore
    schema: ns,
  });
  await sequelize.query(`DROP TYPE ${ns}.enum_user_status;`);
  await sequelize.query(`DROP TYPE ${ns}.enum_user_roles;`);
};
