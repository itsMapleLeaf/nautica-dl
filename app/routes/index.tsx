import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  SearchIcon,
} from "@heroicons/react/solid"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  Form,
  Link,
  useFetcher,
  useLocation,
  useNavigate,
  useSearchParams,
} from "remix"
import { cx } from "twind"
import { BrowserWindow } from "~/electron.server"
import type { NauticaSong } from "~/nautica"
import { loadSongs } from "~/nautica"
import { useLoaderDataTyped } from "~/remix-typed"
import {
  buttonIconLeftClass,
  buttonIconRightClass,
  clearButtonClass,
  clearInputClass,
  iconClass,
  inlineIconClass,
  maxWidthContainer,
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

export async function action({ request }: DataFunctionArgs) {
  const body = Object.fromEntries(await request.formData())

  if (body.actionType === "openSettings") {
    const parent = BrowserWindow.getFocusedWindow()!
    const child = new BrowserWindow({
      parent,
      modal: true,
      show: false,
      width: 500,
      height: 400,
    })
    child.once("ready-to-show", () => child.show())
    await child.loadURL("http://localhost:3000/settings")
  }

  return ""
}

export default function App() {
  const location = useLocation()
  const fetcher = useFetcher()

  return (
    <div className="isolate">
      <header className="sticky top-0 bg-stone-800 p-3 z-10 shadow">
        <div className={cx("flex gap-2", maxWidthContainer)}>
          <fetcher.Form method="post">
            <input type="hidden" name="actionType" value="openSettings" />
            <button type="submit" title="Settings" className={clearButtonClass}>
              <CogIcon className={inlineIconClass} />
            </button>
          </fetcher.Form>
          <SearchForm key={location.key} />
        </div>
      </header>
      <div className={cx("grid gap-3 p-3", maxWidthContainer)}>
        <Pagination />
        <main>
          <SongList />
        </main>
        <Pagination />
      </div>
    </div>
  )
}

function SearchForm() {
  const params = Object.fromEntries(useSearchParams()[0])
  const navigate = useNavigate()

  const [query, setQuery] = useState(params.query)

  useEffect(() => {
    // only navigate if the query has changed, to prevent fetching too often
    if (query === params.query) return
    console.log("ran", query, params.query)

    const timeout = setTimeout(() => {
      navigate(`?query=${query ?? ""}`)
    }, 500)
    return () => clearTimeout(timeout)
  }, [query, params.query, navigate])

  return (
    <Form method="get" className="contents">
      <div className="flex-1">
        <InputWithIcon
          type="search"
          name="query"
          placeholder="Search..."
          icon={<SearchIcon className={iconClass} />}
          defaultValue={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <button type="submit" className={solidButtonClass}>
        <SearchIcon className={buttonIconLeftClass} /> Search
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
          <ChevronLeftIcon className={buttonIconLeftClass} /> Previous Page
        </Link>
      ) : undefined}
      {data.links.next ? (
        <Link to={`?` + nextPageUrl} className={clearButtonClass}>
          Next Page <ChevronRightIcon className={buttonIconRightClass} />
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
    <article className={cx(raisedPanelClass, "h-full flex flex-col relative")}>
      <h2 className="p-3 flex flex-col justify-center text-center flex-1">
        <div className="font-heading leading-tight">
          <span className="sr-only">Artist: </span> {song.artist}
        </div>
        <div className="font-heading text-2xl leading-tight">
          <span className="sr-only">Title: </span> {song.title}
        </div>
      </h2>

      <img src={song.jacket_url} alt="" className="aspect-square" />

      <ul aria-label="Charts" className="grid grid-flow-col auto-cols-fr">
        {song.charts
          .sort((a, b) => a.difficulty - b.difficulty)
          .map((chart) => (
            <li
              key={chart.id}
              className={cx(
                "flex items-center justify-center py-2",
                chart.difficulty === 1 && "bg-sky-500/40",
                chart.difficulty === 2 && "bg-amber-500/40",
                chart.difficulty === 3 && "bg-red-500/40",
                chart.difficulty === 4 && "bg-fuchsia-500/40",
              )}
            >
              <span className="sr-only">
                {chartDifficultyName(chart.difficulty)}
              </span>{" "}
              {chart.level}
            </li>
          ))}
      </ul>
    </article>
  )
}

function InputWithIcon({
  icon,
  ...props
}: { icon: ReactNode } & ComponentPropsWithoutRef<"input">) {
  return (
    <div className="relative">
      <input {...props} className={cx`${clearInputClass} pl-9 w-full`} />
      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 opacity-50 pointer-events-none">
        {icon}
      </span>
    </div>
  )
}

function chartDifficultyName(difficulty: number): string {
  if (difficulty === 1) return "Beginner"
  if (difficulty === 2) return "Advanced"
  if (difficulty === 3) return "Exhaust"
  if (difficulty === 4) return "Infinite"
  return ""
}

function maybeFiniteNumber(value: unknown): number | undefined {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}
