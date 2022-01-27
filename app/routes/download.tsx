import type { DataFunctionArgs } from "@remix-run/server-runtime"
import AdmZip from "adm-zip"
import { captureError, toError } from "~/modules/common/errors"
import { store } from "~/store.server"

export async function action({ request }: DataFunctionArgs) {
  const body = Object.fromEntries(await request.formData())
  const downloadUrl = String(body.downloadUrl)

  const downloadFolder = store.get("savePath")
  if (!downloadFolder) return { error: "No save path set" }

  const response = await captureError(fetch(downloadUrl))
  if (response.error) {
    return { error: "Failed to fetch" }
  }

  const arrayBuffer = await captureError(response.value.arrayBuffer())
  if (arrayBuffer.error) {
    return { error: "Failed to download" }
  }

  try {
    const zip = new AdmZip(Buffer.from(arrayBuffer.value))
    zip.extractAllTo(downloadFolder, true)
  } catch (error) {
    return { error: `Unzip failed: ${toError(error).message}` }
  }

  return {}
}
export { action as downloadAction }
