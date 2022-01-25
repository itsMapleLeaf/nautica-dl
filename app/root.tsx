import type { MetaFunction } from "remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import fonts from "./fonts.css"
import tailwind from "./tailwind.out.css"

export const meta: MetaFunction = () => {
  return { title: "Nautica Downloader" }
}

export default function App() {
  return (
    <html lang="en" className="bg-stone-900 text-stone-100 font-body">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={fonts} />
        <link rel="stylesheet" href={tailwind} />
        <Meta />
        <Links />
      </head>
      <body>
        <h1 className="font-heading text-4xl font-light">Nautica Downloader</h1>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}
