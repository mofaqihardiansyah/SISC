"use client"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  loading?: boolean
}

function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = "Ya", cancelLabel = "Batal",
  variant = "default", loading
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full shrink-0 ${variant === "danger" ? "bg-rose-100" : "bg-primary/10"}`}>
          <AlertTriangle size={20} className={variant === "danger" ? "text-rose-600" : "text-primary"} />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">{message}</p>
      </div>
      <div className="flex items-center justify-end gap-3 mt-6">
        <Button onClick={onClose} variant="outline" disabled={loading}>{cancelLabel}</Button>
        <Button
          onClick={onConfirm}
          variant={variant === "danger" ? "destructive" : "default"}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

export { ConfirmDialog }
