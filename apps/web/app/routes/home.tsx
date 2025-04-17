import { buttonVariants } from "@workspace/ui/components/button";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "React Router v7 Monorepo" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 text-center">
        <p className="font-mono text-muted-foreground">
          👋 {loaderData.message}
        </p>
        <h1 className="my-6 font-semibold text-2xl">
          React Router v7 Monorepo!
        </h1>
        <Link
          to="https://github.com/foxlau/react-router-v7-monorepo"
          className={buttonVariants()}
        >
          Star on GitHub ↗
        </Link>
      </div>
    </div>
  );
}
