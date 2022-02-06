// @ts-check
const { app, dialog } = require("electron")
const { initRemix } = require("./remix.cjs")
const { createWindow } = require("./window.cjs")

void (async () => {
  try {
    initRemix()
    await app.whenReady()
    await createWindow()
  } catch (error) {
    dialog.showErrorBox(
      "Error",
      // @ts-expect-error
      error?.stack || error?.message || String(error),
    )
  }
})()
