import { Show, createEffect } from "solid-js";
// import { Todos } from "~/components/feature/Todos";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
// import { getSession } from "~/functions/session";
import { css } from "~/styled-system/css";

export default function Home() {
    // const { session, signIn } = getSession();

    // createEffect(() => {
    //     console.log("session", session());
    // });

    return (
        <main
            class={css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                h: "screen",
            })}
        >
            asdasd
        </main>
    );
}
