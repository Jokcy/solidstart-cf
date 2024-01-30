import { Button } from "~/components/Button";
import * as Card from "~/components/Card";
import { css } from "~/styled-system/css";
import {} from "@solidjs/start";

export default function Login() {
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
                    <Card.Title>Sign In {process.env.DB || "aaa"}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Button>Login Via Github</Button>
                </Card.Body>
            </Card.Root>
        </div>
    );
}
