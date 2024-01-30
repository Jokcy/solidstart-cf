import { Button } from "~/components/Button";
import * as Card from "~/components/Card";
import { css } from "~/styled-system/css";
// import {} from "@solidjs/start";
import { getRequestEvent } from "solid-js/web";

function hasDB() {
    "use server";

    const requestEvent = getRequestEvent();

    return Object.keys(requestEvent?.context?.cloudflare?.DB || {}).join(",");
}

export default function Login() {
    const inDB = hasDB();

    return (
        <div
            class={css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            })}
        >
            <Card.Root>
                <Card.Header>
                    <Card.Title>Sign In {inDB}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Button>Login Via Github</Button>
                </Card.Body>
            </Card.Root>
        </div>
    );
}
