import { Title } from "@solidjs/meta";
import {
    cache,
    createAsync,
    revalidate,
    action,
    useAction,
} from "@solidjs/router";
import { desc } from "drizzle-orm";
import { For } from "solid-js";
import { getDB } from "~/server/database/db";
import { todos } from "~/server/database/schema";
import { css } from "~/styled-system/css";

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

export default function Home() {
    const todos = createAsync(getTodos);

    const add = useAction(addTodo);

    return (
        <main class={css({ bg: "red.500" })}>
            <input
                type="text"
                placeholder="New Todo"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        add(e.currentTarget.value);
                        e.currentTarget.value = "";
                    }
                }}
            ></input>
            <For each={todos()}>{({ title }) => <Title>{title}</Title>}</For>
        </main>
    );
}
