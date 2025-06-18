import { ProductionErrorDisplay } from "~/components/error-boundary";
import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Not Found" }];
};

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  return (
    <ProductionErrorDisplay
      message="Oops! Page Not Found."
      detail="It seems like the page you're looking for does not exist or might have been removed."
    />
  );
}
