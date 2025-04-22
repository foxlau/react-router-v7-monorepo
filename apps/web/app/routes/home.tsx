import { Github, ListTodo } from "lucide-react";
import { Link } from "react-router";

import { buttonVariants } from "@workspace/ui/components/button";
import { env } from "~/lib/env.server";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "React Router v7 Monorepo" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    mode: env.ENVIRONMENT,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-lg p-6">
        <p className="font-mono text-muted-foreground">
          <span className="text-lg">👋</span> {loaderData.message}
          {" in "}
          {loaderData.mode} mode
        </p>
        <div className="my-6 flex flex-col gap-2">
          <h1 className="font-semibold text-2xl">React Router v7 Monorepo!</h1>
          <p className="text-base opacity-80">
            This is a streamlined example demonstrating the use of React Router
            v7 within a monorepo, integrating Cloudflare Workers, Drizzle ORM
            with D1, Shadcn/UI, and Tailwind CSS v4.
          </p>
        </div>
        <div className="space-x-2">
          <a
            href="https://github.com/foxlau/react-router-v7-monorepo"
            target="_blank"
            className={buttonVariants()}
            rel="noreferrer"
          >
            <Github />
            Star on GitHub ↗
          </a>

          <Link to="/todos" className={buttonVariants()}>
            <ListTodo />
            Todo List
          </Link>
        </div>
      </div>
    </div>
  );
}
