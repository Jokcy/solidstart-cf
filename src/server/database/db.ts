import { drizzle as drizzleD1, DrizzleD1Database } from "drizzle-orm/d1";
// import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
// @ts-ignore
// import Database from "better-sqlite3";
// import { join } from "pathe";
import { getRequestEvent } from "solid-js/web";
import { todos } from "../database/schema";

export * as tables from "../database/schema";

const schema = {
    todos: todos,
};

let _db: DrizzleD1Database<typeof schema> | null =
    // | BetterSQLite3Database<typeof schema>
    null;

const isDev = process.env.NODE_ENV === "development";

export const getDB = () => {
    const event = getRequestEvent();

    const D1 = event?.context?.cloudflare?.env?.DB;

    if (!_db) {
        if (D1) {
            // d1 in production
            _db = drizzleD1(D1, {
                schema,
            });
        }
        //  else if (isDev) {
        //     // local sqlite in development
        //     const sqlite = new Database(join(process.cwd(), "./db.sqlite"));
        //     _db = drizzle(sqlite, {
        //         schema,
        //         logger: true,
        //     });
        // }
        else {
            throw new Error("No database configured for production");
        }
    }
    return _db;
};
