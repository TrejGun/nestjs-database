import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV}`,
});

export default {
  [process.env.NODE_ENV]: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    dialect: "postgres",
  },
};

