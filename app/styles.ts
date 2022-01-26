import { cx } from "twind"

const focusBaseClass = cx`focus:outline-none ring-red-500`
const focusClass = cx(focusBaseClass, cx`focus:ring-2`)
const focusVisibleClass = cx(focusBaseClass, cx`focus-visible:ring-2`)

const inputPaddingClass = cx`px-3 py-2`

export const raisedPanelClass = cx`bg-stone-800 shadow rounded-md overflow-hidden`

export const inputClass = cx(raisedPanelClass, inputPaddingClass, focusClass)

const activePressClass = cx`active:(transition-none shadow-none translate-y-[2px])`

export const solidButtonClass = cx(
  inputPaddingClass,
  focusVisibleClass,
  activePressClass,
  cx`
    bg-red-700 shadow rounded-md overflow-hidden
    transition duration-100
    hover:bg-red-800
  `,
)

export const clearButtonClass = cx(
  inputPaddingClass,
  focusVisibleClass,
  activePressClass,
  cx`bg-black/70 rounded-md transition opacity-50 hover:opacity-100`,
)

export const scrollbarClass = cx`
  scrollbar:(w-3 h-3 bg-transparent)
  scrollbar-thumb:(bg-stone-600 hover:bg-stone-500 active:bg-stone-700)
`

export const iconClass = cx`w-5`
export const inlineIconClass = cx`${iconClass} inline align-text-bottom leading-none`
export const buttonIconLeftClass = cx`${inlineIconClass} -ml-1`
export const buttonIconRightClass = cx`${inlineIconClass} -mr-1`
