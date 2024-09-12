import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...toast, id: Date.now().toString() },
    ])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return { addToast, removeToast, toasts }
}