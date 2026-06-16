// Import the generated Prisma client JS. Avoid importing the .ts file at runtime.
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Create a PG pool using DATABASE_URL from env. The pool-based adapter is used by Prisma.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
