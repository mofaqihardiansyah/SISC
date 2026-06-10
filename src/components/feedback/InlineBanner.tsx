"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type BannerVariant = "success" | "error" | "warning" | "info"

const variantStyles: Record<BannerVariant, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-700",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
}

interface InlineBannerProps {
  variant?: BannerVariant
  message: string
  onDismiss?: () => void
  className?: string
}

function InlineBanner({ variant = "info", message, onDismiss, className }: InlineBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 border p-4 rounded-xl text-sm font-medium",
        variantStyles[variant],
        className
      )}
    >
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export { InlineBanner }
export type { BannerVariant }
