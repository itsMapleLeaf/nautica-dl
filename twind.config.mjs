// @ts-check
import tailwind from "@twind/preset-tailwind"
import { defineConfig } from "twind"
import tailwindConfig from "./tailwind.config.cjs"

export default defineConfig({
  ...tailwindConfig,
  presets: [tailwind()],
  variants: [
    ["scrollbar", "::-webkit-scrollbar"],
    ["scrollbar-thumb", "::-webkit-scrollbar-thumb"],
  ],
})
