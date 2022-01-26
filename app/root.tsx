import type { MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import { cx } from "twind"
import fonts from "./fonts.css"
import { scrollbarClass } from "./styles"

export const meta: MetaFunction = () => {
  return { title: "Nautica Downloader" }
}

export default function App() {
  return (
    <html
      lang="en"
      className={cx("bg-stone-900 text-stone-100 font-body", scrollbarClass)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={fonts} />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-full max-w-screen-lg mx-auto p-3">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
