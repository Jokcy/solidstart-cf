import { action, redirect, useAction } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import cookie from "cookie";
import { jwtVerify } from "jose";

export type Session = {
    id: number;
    name: string;
    avatar: string;
};

const [session, setSession] = createSignal<Session | null>();

export const getSessionFromCookie = async () => {
    "use server";

    const SECRET = process.env.JWT_SECRET!;

    const secret = new TextEncoder().encode(SECRET);

    const event = getRequestEvent();

    const cookieString = event?.request.headers.get("cookie");

    const cookieObject = cookie.parse(cookieString || "");

    const token = cookieObject["__session_id__"];

    if (token) {
        try {
            const { payload } = await jwtVerify<Session>(token, secret);

            if (!payload.id) {
                throw new Error("Invalid token");
            }

            return {
                id: payload.id,
                name: payload.name,
                avatar: payload.avatar,
            };
        } catch (error) {
            console.error(error);
            return null;
        }
    } else {
        return null;
    }
};

const createSession = action(getSessionFromCookie);

const signIn = action(async () => {
    "use server";

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    throw redirect(
        `https://github.com/login/oauth/authorize?client_id=${clientId}`,
    );
});

export function getSession() {
    const createSessionAction = useAction(createSession);
    const signInAction = useAction(signIn);

    onMount(async () => {
        if (!session()) {
            const s = await createSessionAction();
            console.log(s);
            s && setSession(s);
        }
    });

    return {
        session,
        signIn: signInAction,
    };
}
