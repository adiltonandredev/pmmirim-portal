"use client"

import { useState } from "react"

interface FeedbackState {
  open: boolean
  type: "success" | "error"
  title: string
  message?: string
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    open: false,
    type: "success",
    title: "",
  })

  const showSuccess = (title: string, message?: string) =>
    setFeedback({ open: true, type: "success", title, message })

  const showError = (title: string, message?: string) =>
    setFeedback({ open: true, type: "error", title, message })

  const close = () => setFeedback((f) => ({ ...f, open: false }))

  return { feedback, showSuccess, showError, close }
}
