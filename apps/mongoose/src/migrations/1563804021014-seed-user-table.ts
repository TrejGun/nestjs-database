import { MigrationFn } from "umzug";
import { Connection } from "mongoose";

export const up: MigrationFn<Connection> = async ({ context: connection }) => {
  await connection.models.UserModel.create({
    firstName: "Trej",
    lastName: "Gun",
    email: "trejgun@gmail.com",
    password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
    roles: ["ADMIN"],
    status: "ACTIVE",
  });
};

export const down: MigrationFn<Connection> = async ({ context: connection }) => {
  await connection.collections.usermodels.drop();
};
