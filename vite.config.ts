import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    server: {
        port: 3003,
    },
    start: {
        server: {
            preset: "cloudflare-module",
        },
    },
});
