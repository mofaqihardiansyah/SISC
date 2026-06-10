"use client"

import { cn } from "@/lib/utils"

interface ProgressOverlayProps {
  open: boolean
  processed: number
  total: number
  message?: string
}

function ProgressOverlay({ open, processed, total, message }: ProgressOverlayProps) {
  if (!open) return null

  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">
          {message || "Memproses..."}
        </p>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full bg-brand-primary transition-all duration-300 rounded-full")}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 font-medium">
          {processed}/{total} ({percentage}%)
        </p>
      </div>
    </div>
  )
}

export { ProgressOverlay }
