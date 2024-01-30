import { join } from "pathe";
import type { Config } from "drizzle-kit";

export default {
    out: "src/server/database/migrations",
    schema: "src/server/database/schema.ts",
    driver: "better-sqlite",
    dbCredentials: {
        url: join(process.cwd(), "./db.sqlite"),
    },
} satisfies Config;
