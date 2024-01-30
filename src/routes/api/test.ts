import { type APIEvent } from "@solidjs/start/server";
import { useDB } from "~/server/database/db";

export function GET(event: APIEvent) {
    const c = event.context;

    const db = useDB({ D1: event.context?.cloudflare?.DB });

    return new Response(event.context.cloudflare);
}
