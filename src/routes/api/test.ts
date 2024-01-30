import { type APIEvent } from "@solidjs/start/server";

export function GET(event: APIEvent) {
    const c = event.context;

    console.log(event.context.cloudflare);

    return new Response(event.context.cloudflare);
}
