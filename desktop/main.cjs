// @ts-check
const { app, dialog } = require("electron")
const {
  registerRemixProtocol,
  registerRemixProtocolAsPriviledged,
} = require("./register-remix-protocol.cjs")
const { createWindow } = require("./window.cjs")

void (async () => {
  try {
    registerRemixProtocolAsPriviledged()
    await app.whenReady()
    registerRemixProtocol()
    await createWindow()
  } catch (error) {
    dialog.showErrorBox(
      "Error",
      // @ts-expect-error
      error?.stack || error?.message || String(error),
    )
  }
})()
