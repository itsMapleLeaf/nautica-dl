import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"
import { Form, Link, useNavigate, useSearchParams } from "remix"
import { loadSongs } from "~/nautica"
import { useLoaderDataTyped } from "~/remix-typed"

export function loader({ request }: DataFunctionArgs) {
  const params = new URL(request.url).searchParams
  return loadSongs({
    page: maybeFiniteNumber(params.get("page")),
    query: params.get("query") || undefined,
  })
}

export default function Index() {
  const data = useLoaderDataTyped<typeof loader>()

  const [params] = useSearchParams()
  const navigate = useNavigate()

  const queryParam = params.get("query")
  const [query, setQuery] = useState(queryParam ?? "")

  const page = Math.max(maybeFiniteNumber(params.get("page")) ?? 1, 1)

  useEffect(() => {
    // only navigate if the query has changed, to prevent fetching too often
    if (query === queryParam) return

    const timeout = setTimeout(() => {
      navigate(`?query=${query}`)
    }, 500)
    return () => clearTimeout(timeout)
  }, [query, queryParam, navigate])

  return (
    <>
      <Form method="get">
        <input
          type="search"
          name="query"
          defaultValue={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </Form>
      <ul>
        {data.data.map((song) => (
          <li key={song.id}>{song.title}</li>
        ))}
      </ul>
      {data.data.length === 0 && <p>No results found :(</p>}
      {data.links.prev ? (
        <Link to={`?page=${page - 1}&query=${query}`}>Last Page</Link>
      ) : undefined}
      {data.links.next ? (
        <Link to={`?page=${page + 1}&query=${query}`}>Next Page</Link>
      ) : undefined}
    </>
  )
}

function maybeFiniteNumber(value: unknown): number | undefined {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}
