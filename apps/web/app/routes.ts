import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/todos", "routes/todos.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
