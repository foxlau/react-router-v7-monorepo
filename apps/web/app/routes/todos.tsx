import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { and, eq, sql } from "drizzle-orm";
import { ArrowLeft, ListTodoIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link, data, useFetcher, useNavigation } from "react-router";
import { z } from "zod";

import { type SelectTodo, todosTable } from "@workspace/db";
import { formatDate } from "@workspace/shared/utils";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

import { db } from "~/lib/db.server";
import type { Route } from "./+types/todos";

export const schema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("deleteTodo"),
    id: z.string(),
  }),
  z.object({
    intent: z.literal("createTodo"),
    title: z.string().min(1).max(255),
  }),
  z.object({
    intent: z.literal("toggleTodo"),
    id: z.string(),
  }),
]);

export const meta: Route.MetaFunction = () => [{ title: "Todo List" }];

export async function loader() {
  const todos = await db.query.todosTable.findMany({
    orderBy: (todos, { desc }) => [desc(todos.createdAt)],
  });
  return data({ todos });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return data(submission.reply(), { status: 400 });
  }

  switch (submission.value.intent) {
    case "createTodo":
      await db.insert(todosTable).values({
        title: submission.value.title,
      });
      break;
    case "deleteTodo":
      await db
        .delete(todosTable)
        .where(eq(todosTable.id, Number(submission.value.id)));
      break;
    case "toggleTodo":
      await db
        .update(todosTable)
        .set({
          completed: sql`CASE WHEN completed = 0 THEN 1 ELSE 0 END`,
        })
        .where(and(eq(todosTable.id, Number(submission.value.id))));
      break;
  }

  return data(submission.reply({ resetForm: true }));
}

export default function TodosRoute({
  loaderData: { todos },
  actionData,
}: Route.ComponentProps) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    lastResult: actionData,
    constraint: getZodConstraint(schema),
    shouldRevalidate: "onInput",
  });

  const navigation = useNavigation();
  const isSubmitting =
    navigation.state !== "idle" &&
    navigation.formData?.get("intent") === "createTodo";

  return (
    <>
      <div className="p-6">
        <Link
          to="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft />
          Back
        </Link>
      </div>
      <div className="mx-auto max-w-2xl space-y-6 p-6 sm:space-y-12 sm:p-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 font-semibold text-lg leading-none">
              <ListTodoIcon className="size-5 opacity-60" />
              Todo List
            </h1>
            <div className="text-muted-foreground text-sm">
              Today is {formatDate(new Date(), "MMMM d, yyyy")}
            </div>
          </div>

          {/* Form */}
          <Form method="POST" className="space-y-2" {...getFormProps(form)}>
            <div className="flex gap-2">
              <Input
                placeholder="Add a todo"
                {...getInputProps(fields.title, { type: "text" })}
              />
              <Button
                type="submit"
                name="intent"
                value="createTodo"
                disabled={isSubmitting}
              >
                Add
              </Button>
            </div>
            {fields.title.errors && (
              <p
                className="mt-2 text-destructive text-xs"
                role="alert"
                aria-live="polite"
              >
                {fields.title.errors.join(", ")}
              </p>
            )}
          </Form>

          {/* Todos */}
          {todos.length === 0 ? (
            <p className="text-muted-foreground text-sm">No todos found</p>
          ) : (
            <ul className="divide-y overflow-hidden rounded-lg border shadow-xs">
              {todos.map((todo: SelectTodo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function TodoItem({ todo }: { todo: SelectTodo }) {
  const fetcher = useFetcher();
  const [isChecked, setIsChecked] = useState(todo.completed);
  const isSubmitting = fetcher.state !== "idle";
  const id = todo.id.toString();

  return (
    <li
      key={todo.id}
      className="flex items-center gap-2 p-2 pl-3 hover:bg-accent"
    >
      <label htmlFor={todo.id.toString()} className="flex items-center gap-2">
        <Checkbox
          id={id}
          name={id}
          disabled={isSubmitting}
          checked={isChecked}
          onCheckedChange={() => {
            setIsChecked(!isChecked);
            fetcher.submit(
              {
                intent: "toggleTodo",
                id,
              },
              { method: "POST", preventScrollReset: true },
            );
          }}
        />
        <span
          className={cn("font-medium", {
            "text-muted-foreground line-through": isChecked,
          })}
        >
          {todo.title}
        </span>
      </label>
      <Button
        type="submit"
        name="intent"
        value="deleteTodo"
        className="ml-auto size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        size="icon"
        variant="ghost"
        disabled={isSubmitting}
        onClick={() => {
          fetcher.submit(
            {
              intent: "deleteTodo",
              id,
            },
            { method: "POST", preventScrollReset: true },
          );
        }}
      >
        <TrashIcon className="size-4" />
      </Button>
    </li>
  );
}
