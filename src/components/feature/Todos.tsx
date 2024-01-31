import {
    cache,
    createAsync,
    revalidate,
    action,
    useAction,
} from "@solidjs/router";
import { desc } from "drizzle-orm";
import { For, createEffect } from "solid-js";
import { Button } from "~/components/ui/Button";
import * as Card from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { getDB } from "~/server/database/db";
import { todos } from "~/server/database/schema";
import { css } from "~/styled-system/css";
import { Trash2 } from "lucide-solid";
import { Switch } from "~/components/ui/Switch";

const getTodos = cache(async () => {
    "use server";
    const db = getDB();

    const result = await db.query.todos.findMany({
        orderBy: [desc(todos.createdAt)],
    });

    return result.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt.toISOString(),
    }));
}, "getTodos");

const addTodo = action(async (text: string) => {
    "use server";
    const db = getDB();

    console.log("running", text);

    const x = await db
        .insert(todos)
        .values({
            title: text,
            createdAt: new Date(),
        })
        .returning()
        .execute();

    console.log(x);

    revalidate(getTodos.key);
}, "addTodo");

export function Todos() {
    const todos = createAsync(getTodos);

    const add = useAction(addTodo);

    createEffect(() => {
        console.log(todos());
    });

    return (
        <main
            class={css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                h: "screen",
            })}
        >
            <div class={css({ width: "500px" })}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>TODOS</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Input
                            type="text"
                            placeholder="New Todo"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    add(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                            size="lg"
                        ></Input>
                        <For each={todos()}>
                            {({ title }) => (
                                <div
                                    class={css({
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 4,
                                    })}
                                >
                                    <p
                                        class={css({
                                            flexGrow: 1,
                                            fontSize: "large",
                                        })}
                                    >
                                        {title}
                                    </p>
                                    <div
                                        class={css({
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            gap: 2,
                                        })}
                                    >
                                        <Switch></Switch>
                                        <Button
                                            variant="subtle"
                                            colorPalette="red"
                                            size="xs"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </For>
                    </Card.Body>
                </Card.Root>
            </div>
        </main>
    );
}
