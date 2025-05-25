import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ENV from "../env";

// for query purposes
const queryClient = postgres(
	`postgres://${ENV.POSTGRES_USER}:${ENV.POSTGRES_PASSWORD}@${ENV.POSTGRES_HOST}:${ENV.POSTGRES_PORT}/${ENV.POSTGRES_SCHEMA}`
);

const db = drizzle(queryClient, { logger: !ENV.isProd });

export default db;
