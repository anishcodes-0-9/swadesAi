import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env")
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? ""
};

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}
