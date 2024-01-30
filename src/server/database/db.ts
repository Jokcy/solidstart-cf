import { drizzle as drizzleD1, DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleLibSQL, LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
// @ts-ignore
import Database from "better-sqlite3";
import { join } from "pathe";

export * as tables from "../database/schema";

let _db: DrizzleD1Database | BetterSQLite3Database | LibSQLDatabase | null =
    null;

const isDev = process.env.NODE_ENV === "development";

export const useDB = ({ D1 }: { D1: any }) => {
    if (!_db) {
        if (D1) {
            // d1 in production
            _db = drizzleD1(D1);
        } else if (isDev) {
            // local sqlite in development
            const sqlite = new Database(join(process.cwd(), "./db.sqlite"));
            _db = drizzle(sqlite);
        } else {
            throw new Error("No database configured for production");
        }
    }
    return _db;
};
