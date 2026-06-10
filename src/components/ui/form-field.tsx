import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label?: string
  error?: string | null
  required?: boolean
  children: React.ReactNode
  className?: string
}

function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}

export { FormField }
