import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"
import { Form, Link, useLocation, useNavigate, useSearchParams } from "remix"
import { cx } from "twind"
import type { NauticaSong } from "~/nautica"
import { loadSongs } from "~/nautica"
import { useLoaderDataTyped } from "~/remix-typed"
import {
  clearButtonClass,
  inputClass,
  raisedPanelClass,
  solidButtonClass,
} from "~/styles"

export function loader({ request }: DataFunctionArgs) {
  const params = Object.fromEntries(new URL(request.url).searchParams)
  return loadSongs({
    page: maybeFiniteNumber(params.page),
    query: params.query || undefined,
  })
}

export default function Index() {
  const location = useLocation()
  return (
    <main className="grid gap-3 p-3 w-full max-w-screen-lg mx-auto">
      <SearchForm key={location.key} />
      <Pagination />
      <SongList />
      <Pagination />
    </main>
  )
}

function SearchForm() {
  const params = Object.fromEntries(useSearchParams()[0])
  const navigate = useNavigate()

  const [query, setQuery] = useState(params.query ?? "")

  useEffect(() => {
    // only navigate if the query has changed, to prevent fetching too often
    if (query === params.query) return

    const timeout = setTimeout(() => {
      navigate(`?query=${query}`)
    }, 500)
    return () => clearTimeout(timeout)
  }, [query, params.query, navigate])

  return (
    <Form method="get" className="flex gap-2">
      <input
        type="search"
        name="query"
        placeholder="Search..."
        defaultValue={query}
        onChange={(event) => setQuery(event.target.value)}
        className={cx`${inputClass} flex-1`}
      />
      <button type="submit" className={solidButtonClass}>
        Search
      </button>
    </Form>
  )
}

function Pagination() {
  const data = useLoaderDataTyped<typeof loader>()
  const params = Object.fromEntries(useSearchParams()[0])
  const page = Math.max(maybeFiniteNumber(params.page) ?? 1, 1)

  const nextPageUrl = new URLSearchParams({
    ...params,
    page: String(page + 1),
  }).toString()

  const prevPageUrl = new URLSearchParams({
    ...params,
    page: String(page - 1),
  }).toString()

  return (
    <nav className="flex mx-auto gap-2">
      {data.links.prev ? (
        <Link to={`?` + prevPageUrl} className={clearButtonClass}>
          Last Page
        </Link>
      ) : undefined}
      {data.links.next ? (
        <Link to={`?` + nextPageUrl} className={clearButtonClass}>
          Next Page
        </Link>
      ) : undefined}
    </nav>
  )
}

function SongList() {
  const data = useLoaderDataTyped<typeof loader>()
  return (
    <>
      {data.data.length > 0 ? (
        <ul className="flex flex-wrap gap-3 justify-center">
          {data.data.map((song) => (
            <li key={song.id} className="w-72">
              <SongCard song={song} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center my-16 text-xl opacity-50">
          No results found :(
        </p>
      )}
    </>
  )
}

function SongCard({ song }: { song: NauticaSong }) {
  return (
    <div className={cx(raisedPanelClass, "h-full flex flex-col relative")}>
      <h2 className="p-3 flex flex-col justify-center text-center flex-1">
        <div className="font-heading leading-tight">{song.artist}</div>
        <div className="font-heading text-2xl leading-tight">{song.title}</div>
      </h2>

      <img
        src={song.jacket_url}
        alt=""
        className="aspect-square shadow-inner"
      />

      <div className="grid grid-flow-col auto-cols-fr">
        {song.charts
          .sort((a, b) => a.difficulty - b.difficulty)
          .map((chart) => (
            <div
              key={chart.id}
              className={cx(
                "flex items-center justify-center py-2",
                chart.difficulty === 1 && "bg-sky-500/40",
                chart.difficulty === 2 && "bg-amber-500/40",
                chart.difficulty === 3 && "bg-red-500/40",
                chart.difficulty === 4 && "bg-fuchsia-500/40",
              )}
            >
              {chart.level}
            </div>
          ))}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between"></div>
    </div>
  )
}

function maybeFiniteNumber(value: unknown): number | undefined {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}
