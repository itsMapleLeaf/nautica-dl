import type { DataFunctionArgs } from "@remix-run/server-runtime"
import AdmZip from "adm-zip"
import { store } from "~/store.server"

export async function action({ request }: DataFunctionArgs) {
  const body = Object.fromEntries(await request.formData())
  const downloadUrl = String(body.downloadUrl)

  const downloadFolder = store.get("savePath")
  if (!downloadFolder) return ""

  const response = await fetch(downloadUrl)
  const zip = new AdmZip(Buffer.from(await response.arrayBuffer()))
  zip.extractAllTo(downloadFolder, true)

  return ""
}
