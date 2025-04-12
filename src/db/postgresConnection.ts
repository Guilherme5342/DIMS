import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import ENV from "../env";

// for query purposes
const queryClient = postgres(ENV.POSTGRES_URL);

const db = drizzle(queryClient, { logger: !ENV.isProd });

export default db;
