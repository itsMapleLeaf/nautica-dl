import { XIcon } from "@heroicons/react/outline"
import { FolderIcon } from "@heroicons/react/solid"
import * as Dialog from "@radix-ui/react-dialog"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Form, useNavigate, useSubmit } from "remix"
import { cx } from "twind"
import { dialog } from "~/electron.server"
import { useLoaderDataTyped } from "~/remix-typed"
import { store } from "~/store.server"
import {
  clearButtonClass,
  clearInputClass,
  inlineIconClass,
  raisedPanelClass,
} from "~/styles"

const savePathStoreKey = "savePath"

const fieldNames = {
  actionType: "actionType",
  savePath: "savePath",
} as const

const actionTypes = {
  setSavePath: "setSavePath",
  chooseSavePathFromDialog: "chooseSavePathFromDialog",
} as const

export function loader() {
  const savePath = maybeString(store.get(savePathStoreKey))
  return { savePath }
}

export async function action({ request }: DataFunctionArgs) {
  const body = await request.formData()
  const actionType = body.get(fieldNames.actionType)

  if (actionType === actionTypes.setSavePath) {
    const savePath = maybeString(body.get(fieldNames.savePath))
    store.set(savePathStoreKey, savePath ?? "")
  }

  if (actionType === actionTypes.chooseSavePathFromDialog) {
    const result = await dialog.showOpenDialog({
      title: "Choose a save folder",
      properties: ["openDirectory", "createDirectory"],
    })

    if (result.filePaths[0]) {
      store.set(savePathStoreKey, result.filePaths[0])
    }
  }

  return ""
}

export default function Settings() {
  return (
    <ModalDialog title="Settings">
      <SavePathField />
    </ModalDialog>
  )
}

function SavePathField() {
  const data = useLoaderDataTyped<typeof loader>()
  const submit = useSubmit()
  const [savePath, setSavePath] = useState(data.savePath ?? "")

  useEffect(() => {
    if (data.savePath) setSavePath(data.savePath)
  }, [data.savePath])

  useEffect(() => {
    if (savePath === data.savePath) return

    const timeout = setTimeout(() => {
      submit(
        {
          [fieldNames.actionType]: actionTypes.setSavePath,
          [fieldNames.savePath]: savePath,
        },
        { replace: true },
      )
    }, 500)
    return () => clearTimeout(timeout)
  }, [data.savePath, savePath, submit])

  return (
    <div
      className="grid gap-x-2 gap-y-1"
      style={{ gridTemplateColumns: "1fr auto" }}
    >
      <Form method="post" className="contents" replace>
        <label htmlFor="savePath" className="text-sm font-bold col-span-2">
          Save path
        </label>
        <input
          id="savePath"
          name="savePath"
          placeholder="/path/to/usc-game/songs/Nautica"
          className={clearInputClass}
          value={savePath}
          onChange={(event) => setSavePath(event.target.value)}
        />
        <input
          type="hidden"
          name={fieldNames.actionType}
          value={actionTypes.setSavePath}
        />
        <button type="submit" hidden />
      </Form>

      <Form method="post" replace>
        <input
          type="hidden"
          name={fieldNames.actionType}
          value={actionTypes.chooseSavePathFromDialog}
        />
        <button
          type="submit"
          className={clearButtonClass}
          title="Choose folder..."
        >
          <FolderIcon className={inlineIconClass} />
        </button>
      </Form>
    </div>
  )
}

function ModalDialog({
  title,
  children,
}: {
  title: ReactNode
  children: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <Dialog.Root open onOpenChange={() => navigate("/")}>
      <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-filter backdrop-blur" />
      <div className="fixed inset-0 pointer-events-none flex flex-col">
        <div className="m-auto flex flex-col gap-1 items-end">
          <Dialog.Close className="pointer-events-auto">
            <span className="sr-only">Close</span>{" "}
            <XIcon className={cx(inlineIconClass, "w-6")} />
          </Dialog.Close>
          <Dialog.Content
            className={cx(
              raisedPanelClass,
              "shadow w-[500px] p-4 grid gap-4 pointer-events-auto",
            )}
          >
            <Dialog.Title className="font-heading text-2xl">
              {title}
            </Dialog.Title>
            {children}
          </Dialog.Content>
        </div>
      </div>
    </Dialog.Root>
  )
}

function maybeString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}
