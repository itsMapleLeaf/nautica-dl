import { createContext, useContext, useMemo, useState } from "react"

type Toast = {
  id: string
  message: string
}

type CreateToastOptions = {
  message: string
  duration?: number
}

type ToastActions = {
  create: (options: CreateToastOptions) => ToastInstance
}

export type ToastInstance = {
  setMessage: (message: string) => void
  remove: () => void
}

const ActionsContext = createContext<ToastActions | undefined>(undefined)

export function ToastList({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const actions = useMemo<ToastActions>(() => {
    const create = (options: CreateToastOptions): ToastInstance => {
      const id = `toast-${Math.random()}`

      setToasts((toasts) => [...toasts, { id, message: options.message }])

      const setMessage = (message: string) => {
        setToasts((toasts) =>
          toasts.map((toast) =>
            toast.id === id ? { ...toast, message } : toast,
          ),
        )
      }

      const remove = () => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
      }

      if (options.duration != undefined) {
        setTimeout(remove, options.duration)
      }

      return { setMessage, remove }
    }
    return { create }
  }, [])

  return (
    <ActionsContext.Provider value={actions}>
      {children}
      <section className="fixed inset-0 pointer-events-none">
        <ul className="flex flex-col gap-4 p-4 w-full max-w-md mx-auto">
          {toasts.map((item) => (
            <li key={item.id} className="pointer-events-auto">
              <p
                role="alert"
                className="bg-stone-800 rounded-md shadow px-4 py-3"
              >
                {item.message}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </ActionsContext.Provider>
  )
}

export function useToasts() {
  const actions = useContext(ActionsContext)
  if (!actions) {
    throw new Error("useToasts must be used within a ToastList")
  }
  return actions
}
