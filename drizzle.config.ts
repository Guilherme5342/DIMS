import { defineConfig } from "drizzle-kit";
import ENV from "./src/env";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: { url: ENV.POSTGRES_URL },
	verbose: true,
});
