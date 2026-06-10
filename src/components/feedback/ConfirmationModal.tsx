"use client"

import { AlertTriangle } from "lucide-react"
import Portal from "@/components/ui/Portal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ModalVariant = "danger" | "warning" | "info"

const iconMap: Record<ModalVariant, React.ReactNode> = {
  danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
  info: <AlertTriangle className="w-6 h-6 text-blue-600" />,
}

const iconBg: Record<ModalVariant, string> = {
  danger: "bg-red-100",
  warning: "bg-amber-100",
  info: "bg-blue-100",
}

interface ConfirmationModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ModalVariant
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onCancel}
        />
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", iconBg[variant])}>
              {iconMap[variant]}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-2">{message}</p>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "danger" ? "destructive" : "default"}
              className="flex-1"
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export { ConfirmationModal }
