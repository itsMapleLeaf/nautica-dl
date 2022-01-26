import type { ComponentPropsWithoutRef } from "react"

export function LazyImage({
  className,
  ...props
}: ComponentPropsWithoutRef<"img"> & { src: string; alt: string }) {
  return (
    <div className={className}>
      <img
        {...props}
        loading={props.loading || "lazy"}
        className="w-full h-full transition-opacity"
        ref={(image) => {
          if (!image) return
          if (image.complete) return

          image.style.opacity = "0"
          image.addEventListener(
            "load",
            () => {
              image.style.opacity = "1"
            },
            { once: true },
          )
        }}
        // added to appease the linter
        src={props.src}
        alt={props.alt}
      />
    </div>
  )
}
