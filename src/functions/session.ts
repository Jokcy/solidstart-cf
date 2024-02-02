import { action, redirect, useAction } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const [session, setSession] = createSignal<{
    id: string;
    name: string;
    avatar: string;
} | null>();

const SECRET = process.env.JWT_SECRET!;

export const signJWT = (payload: any) => {
    "use server";
    const token = jwt.sign(payload, SECRET, {
        expiresIn: "1d",
    });

    return token;
};

export const getSessionFromCookie = async () => {
    "use server";

    const event = getRequestEvent();

    const cookieString = event?.request.headers.get("cookie");

    const cookieObject = cookie.parse(cookieString || "");

    const token = cookieObject["__session_id__"];

    if (token) {
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded);

        if (typeof decoded === "string") {
            throw new Error("Invalid token");
        }

        return {
            id: decoded.id,
            name: decoded.name,
            avatar: decoded.avatar,
        };
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
