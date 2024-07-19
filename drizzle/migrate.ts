import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// making a client here just for migrations and then closing it's connection
const pgClient = postgres(process.env.DATABASE_URL!, { max: 1 });
const client = drizzle(pgClient);

// Migrate the database
await migrate(client, { migrationsFolder: "./drizzle/migrations" })

// Close the connection
await pgClient.end();