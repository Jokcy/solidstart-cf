import { Button } from "~/components/ui/Button";
import * as Card from "~/components/ui/Card";
import { css } from "~/styled-system/css";

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
                    <Card.Title>Sign In</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Button>Login Via Github</Button>
                </Card.Body>
            </Card.Root>
        </div>
    );
}
