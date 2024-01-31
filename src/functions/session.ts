import { action, redirect, useAction } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const [session, setSession] = createSignal<{ id: string }>();

const SECRET = "asdasdasdasdasd";

const createSession = action(async () => {
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
});

const signIn = action(async () => {
    "use server";

    throw redirect("https://baidu.com");
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

    return session;
}
