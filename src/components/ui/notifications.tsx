import { toast, Toaster } from "sonner"

/**
 * Simple wrapper around sonner toast to centralize styling and types.
 */
export const notifySuccess = (message: string) => toast.success(message)

export const notifyError = (message: string) => toast.error(message)

export const notifyInfo = (message: string) => toast(message)

export const AppToaster = () => (
  <Toaster
    richColors
    closeButton
    toastOptions={{
      classNames: {
        closeButton: 'text-red-500 hover:text-red-600',
      },
    }}
  />
) 