/* eslint-disable unicorn/prefer-module */
/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "desktop/build",
  devServerPort: 8002,
  ignoredRouteFiles: [".*"],
}
