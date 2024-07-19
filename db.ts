import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle/schema";

// This is the raw client
const pgClient = postgres(process.env.DATABASE_URL!);

export const db = drizzle(pgClient, { schema: schema, logger: true })