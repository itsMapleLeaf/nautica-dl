import { redirect } from "remix"

export function loader() {
  console.warn("Hit an invalid route, redirecting to home")
  return redirect("/", 303)
}
