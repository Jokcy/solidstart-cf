import { Show, createEffect } from "solid-js";
import { Todos } from "~/components/feature/Todos";
import { Avatar } from "~/components/ui/Avatar";
import { Button } from "~/components/ui/Button";
import { getSession } from "~/functions/session";
import { css } from "~/styled-system/css";

export default function Home() {
    const { session, signIn } = getSession();

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
            <Show
                when={session()?.id}
                fallback={
                    <Button
                        onClick={() => {
                            console.log("signin");
                            signIn();
                        }}
                    >
                        Signin
                    </Button>
                }
            >
                <div
                    class={css({
                        mb: 4,
                    })}
                >
                    <Avatar
                        src={session()?.avatar}
                        name={session()?.name}
                        size="2xl"
                    ></Avatar>
                </div>
                <Todos></Todos>
            </Show>
        </main>
    );
}
