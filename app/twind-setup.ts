import { setup } from "@twind/tailwind"
import tailwindConfig from "../tailwind.config.cjs"

setup({
  ...tailwindConfig,
  variants: [
    ["scrollbar", "::-webkit-scrollbar"],
    ["scrollbar-thumb", "::-webkit-scrollbar-thumb"],
  ],
})
