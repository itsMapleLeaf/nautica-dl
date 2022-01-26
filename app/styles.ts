import { cx } from "twind"

const focusBaseClass = cx`focus:outline-none ring-red-500`
const focusClass = cx(focusBaseClass, cx`focus:ring-2`)
const focusVisibleClass = cx(focusBaseClass, cx`focus-visible:ring-2`)

const controlPaddingClass = cx`px-3 py-2`
const clearControlClass = cx`bg-black/40 rounded-md transition text-white/50 hover:text-white hover:bg-black/70 focus:text-white`

export const raisedPanelClass = cx`bg-stone-800 shadow rounded-md overflow-hidden`

export const solidInputClass = cx(
  raisedPanelClass,
  controlPaddingClass,
  focusClass,
)

export const clearInputClass = cx`
  ${controlPaddingClass}
  ${focusClass}
  ${clearControlClass}
  w-full
`

const activePressClass = cx`active:(transition-none shadow-none translate-y-[2px])`

export const solidButtonClass = cx(
  controlPaddingClass,
  focusVisibleClass,
  activePressClass,
  cx`
    bg-red-700 shadow rounded-md overflow-hidden
    transition duration-100
    hover:bg-red-800
  `,
)

export const clearButtonClass = cx(
  controlPaddingClass,
  focusVisibleClass,
  activePressClass,
  clearControlClass,
  `w-fit`,
)

export const scrollbarClass = cx`
  scrollbar:(w-3 h-3 bg-transparent)
  scrollbar-thumb:(bg-stone-600 hover:bg-stone-500 active:bg-stone-700)
`

export const iconClass = cx`w-5`
export const inlineIconClass = cx`${iconClass} inline align-text-bottom leading-none`
export const buttonIconLeftClass = cx`${inlineIconClass} -ml-1`
export const buttonIconRightClass = cx`${inlineIconClass} -mr-1`
