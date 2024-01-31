import { createEffect } from "solid-js";
import { Todos } from "~/components/feature/Todos";
import { getSession } from "~/functions/session";

export default function Home() {
    const session = getSession();

    createEffect(() => {
        console.log("session", session());
    });

    return (
        <div>
            <Todos></Todos>
            <div>{session()?.id}</div>
        </div>
    );
}
