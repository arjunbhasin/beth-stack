import { Elysia, t } from  'elysia';
import { html } from "@elysiajs/html";
import * as elements from 'typed-html';

const app = new Elysia()
    .use(html())
    .get("/", ({ html }) =>
      html(
        <BaseHTML>
            <body 
                class="flex w-full h-screen justify-center items-center"
                hx-get="/todos"
                hx-trigger="load"
                hx-swap="innerHTML"
            />
        </BaseHTML>
      )
    )
    .post("/clicked", ({ html }) => <div class='text-blue-600'>I am from Server</div>)
    .get("/todos", ({ html }) => <TodoList todos={db}/>)
    .post(
        "/todos/toggle/:id",
        ({ params }) => {
            const todo = db.find((todo) => todo.id === params.id);
            if (todo) {
                todo.completed = !todo.completed;
                return <TodoItem {...todo} />;
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),

        }
    )
    .delete(
        "/todos/:id",
        ({ params }) => {
            const index = db.findIndex((todo) => todo.id === params.id);
            if (index !== -1) {
                db.splice(index, 1);
            }
        },
        {
            params: t.Object({
                id: t.String(),
            }),
        }
    )
    .listen(3000);

console.log(`🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`)

const BaseHTML = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

type Todo = {
    id: string;
    content: string;
    completed: boolean;
};

const db: Todo[] = [
    {
        id: '1',
        content: 'Hello',
        completed: false,
    },
    {
        id: '2',
        content: 'World',
        completed: true,
    },
];

const TodoItem = ({ content, completed, id }: Todo) => {
    return (
        <div class="flex flex-row space-x-3">
            <p>{content}</p>
            <input
                type='checkbox' 
                checked={completed} 
                hx-post={`/todos/toggle/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            />
            <button 
                class="text-red-500"
                hx-delete={`/todos/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            >
                X
            </button>
        </div>
    )
};

const TodoList = ({ todos }: { todos: Todo[]}) => {
    return (
        <div>
        {
            todos.map((todo) => <TodoItem {...todo} />)
        }
        </div>
    )
};