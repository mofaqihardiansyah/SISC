"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormStateProps {
  submitted: boolean
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  errorMessage?: string
  error?: boolean
  children: React.ReactNode
}

function FormState({
  submitted,
  successTitle = "Berhasil!",
  successMessage,
  errorTitle = "Gagal",
  errorMessage,
  error = false,
  children,
}: FormStateProps) {
  if (!submitted) return <>{children}</>

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-xl text-center border",
        error
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
      )}
    >
      {error ? (
        <XCircle className="w-12 h-12 text-red-600 mb-3" />
      ) : (
        <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
      )}
      <h3 className={cn(
        "text-lg font-bold",
        error ? "text-red-800" : "text-green-800"
      )}>
        {error ? errorTitle : successTitle}
      </h3>
      {(successMessage || errorMessage) && (
        <p className={cn(
          "mt-1 text-sm",
          error ? "text-red-600" : "text-green-600"
        )}>
          {error ? errorMessage : successMessage}
        </p>
      )}
    </div>
  )
}

export { FormState }
