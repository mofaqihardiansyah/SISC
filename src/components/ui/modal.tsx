"use client"

import { X } from "lucide-react"
import Portal from "@/components/ui/Portal"
import { cn } from "@/lib/utils"

type ModalVariant = "center" | "side" | "side-left"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  variant?: ModalVariant
  className?: string
}

function Modal({ open, onClose, title, children, variant = "center", className }: ModalProps) {
  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />

        {variant === "center" && (
          <div
            className={cn(
              "relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]",
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="overflow-y-auto p-6">{children}</div>
          </div>
        )}

        {variant === "side" && (
          <div className="absolute inset-0 flex items-center justify-end">
            <div
              className={cn(
                "relative w-full max-w-lg bg-white shadow-2xl h-full animate-in slide-in-from-right duration-300 flex flex-col",
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                  <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Tutup"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="overflow-y-auto flex-1 p-6">{children}</div>
            </div>
          </div>
        )}

        {variant === "side-left" && (
          <div className="absolute inset-0 flex items-center justify-start">
            <div
              className={cn(
                "relative w-full max-w-lg bg-white shadow-2xl h-full animate-in slide-in-from-left duration-300 flex flex-col",
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                  <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Tutup"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="overflow-y-auto flex-1 p-6">{children}</div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  )
}

export { Modal }
