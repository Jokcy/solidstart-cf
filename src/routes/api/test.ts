import { type APIEvent } from "@solidjs/start/server";
import { getDB } from "~/server/database/db";

export function GET(event: APIEvent) {
    const db = getDB();

    return new Response(event.context.cloudflare);
}
