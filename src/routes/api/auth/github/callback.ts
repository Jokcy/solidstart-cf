// import { redirect } from "@solidjs/router";
import { APIEvent } from "@solidjs/start/server/types";
import cookie from "cookie";
import { signJWT } from "../../../../functions/session";

export async function GET(event: APIEvent) {
    const request = event.request;
    const url = new URL(request.url);

    const code = url.searchParams.get("code");

    if (!code) {
        return new Response("Bad Request", {
            status: 400,
        });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // const searchParams = new URLSearchParams();

    const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );

    const tokenData: { access_token: string } = await tokenResponse.json();

    console.log(
        "tokenResponse",
        tokenData,
        {
            client_id: clientId,
            client_secret: clientSecret,
            code,
        },
        tokenResponse,
    );

    if (!tokenData.access_token) {
        return new Response("Bad Request", {
            status: 400,
        });
    }

    try {
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                Accept: "application/json",
                "user-agent": "solidjs-cloudflare-pages",
            },
        });

        console.log("userResponse", await userResponse.clone().text());

        const userData: { id: number; name: string; avatar_url: string } =
            await userResponse.json();

        console.log("userResponse", userData);

        return new Response("", {
            status: 302,
            headers: {
                Location: "/",
                "set-cookie": cookie.serialize(
                    "__session_id__",
                    await signJWT({
                        id: userData.id,
                        name: userData.name,
                        avatar: userData.avatar_url,
                    }),
                    {
                        httpOnly: true,
                        path: "/",
                        sameSite: "lax",
                        // domain: "localhost:3001",
                        expires: new Date(
                            Date.now() + 1000 * 60 * 60 * 24 * 365,
                        ),
                    },
                ),
            },
        });
    } catch (err) {
        console.error(err);
    }
}
