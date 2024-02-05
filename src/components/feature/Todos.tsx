import {
    cache,
    createAsync,
    revalidate,
    action,
    useAction,
} from "@solidjs/router";
import { and, desc, eq } from "drizzle-orm";
import { For, createEffect } from "solid-js";
import { Button } from "~/components/ui/Button";
import * as Card from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { getDB } from "~/server/database/db";
import { todos } from "~/server/database/schema";
import { css } from "~/styled-system/css";
import { Trash2 } from "lucide-solid";
import { Switch } from "~/components/ui/Switch";
import { getSessionFromCookie } from "~/functions/session";

const getTodos = cache(async () => {
    "use server";
    const db = getDB();

    const session = await getSessionFromCookie();

    console.log("session", session?.id);

    if (!session?.id) {
        throw new Error("Not authenticated");
    }

    try {
        const result = await db.query.todos.findMany({
            orderBy: [desc(todos.createdAt)],
            where: (todos, { eq }) => eq(todos.userId, session.id),
        });

        console.log("result", result);

        return result.map((todo) => ({
            ...todo,
            createdAt: todo.createdAt.toISOString(),
        }));
    } catch (err) {
        console.error(err);
    }
}, "getTodos");

const addTodo = action(async (text: string) => {
    "use server";
    const db = getDB();

    const session = await getSessionFromCookie();

    if (!session?.id) {
        throw new Error("Not authenticated");
    }

    try {
        await db
            .insert(todos)
            .values({
                title: text,
                createdAt: new Date(),
                userId: session.id,
            })
            .returning()
            .execute();
    } catch (err) {
        console.error(err);
    }
}, "addTodo");

const deleteTodo = action(async (id: number) => {
    "use server";
    const db = getDB();

    const session = await getSessionFromCookie();

    if (!session?.id) {
        throw new Error("Not authenticated");
    }

    try {
        await db
            .delete(todos)
            .where(and(eq(todos.id, id), eq(todos.userId, session.id)))
            .execute();
    } catch (err) {
        console.error(err);
    }
});

const completeTodo = action(async (id: number, state: 0 | 1) => {
    "use server";
    const db = getDB();

    const session = await getSessionFromCookie();

    if (!session?.id) {
        throw new Error("Not authenticated");
    }

    await db
        .update(todos)
        .set({ completed: state })
        .where(and(eq(todos.id, id), eq(todos.userId, session.id)))
        .execute();
});

export function Todos() {
    const todos = createAsync(getTodos);

    const add = useAction(addTodo);

    const remove = useAction(deleteTodo);

    const complete = useAction(completeTodo);

    createEffect(() => {
        console.log(todos());
    });

    createEffect(() => {
        console.log(todos());
    });

    return (
        <div class={css({ width: "500px" })}>
            <Card.Root>
                <Card.Header>
                    <Card.Title>TODOS</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Input
                        type="text"
                        placeholder="New Todo"
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                const currentTarget = e.currentTarget;
                                await add(currentTarget.value);
                                revalidate(getTodos.key);
                                currentTarget.value = "";
                            }
                        }}
                        size="lg"
                    ></Input>
                    <For each={todos()}>
                        {(todo) => {
                            // console.log(id, completed);
                            return (
                                <div
                                    class={css({
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 4,
                                    })}
                                >
                                    <p
                                        class={css(
                                            {
                                                flexGrow: 1,
                                                fontSize: "large",
                                            },
                                            todo.completed
                                                ? {
                                                      textDecoration:
                                                          "line-through",
                                                  }
                                                : {},
                                        )}
                                    >
                                        {todo.title}
                                    </p>
                                    <div
                                        class={css({
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            gap: 2,
                                        })}
                                    >
                                        <Switch
                                            checked={todo.completed === 1}
                                            onCheckedChange={async (v) => {
                                                await complete(
                                                    todo.id,
                                                    v.checked ? 1 : 0,
                                                );
                                                revalidate(getTodos.key);
                                            }}
                                        ></Switch>
                                        <Button
                                            variant="subtle"
                                            colorPalette="red"
                                            size="xs"
                                            onClick={async () => {
                                                await remove(todo.id);
                                                revalidate(getTodos.key);
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </Card.Body>
            </Card.Root>
        </div>
    );
}
