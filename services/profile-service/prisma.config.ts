import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// When running Prisma CLI locally
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.PROFILE_DB_URL,
  },
});
