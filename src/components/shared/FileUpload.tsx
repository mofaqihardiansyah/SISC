"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, Check, Loader2, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { ERROR_MESSAGES, UI_TEXT } from "@/lib/constants";
import { Button } from "@/components/ui/button";

type UploadType = "avatar" | "document" | "banner";

interface FileUploadProps {
  type: UploadType;
  currentUrl?: string;
  onSuccess?: (url: string) => void;
  className?: string;
  /** Tampilan: "dropzone" untuk area besar, "button" untuk tombol compact */
  variant?: "dropzone" | "button";
}

const TYPE_LABELS: Record<UploadType, string> = {
  avatar: "Foto Profil",
  document: "Dokumen PDF",
  banner: "Banner",
};

const ACCEPT_MAP: Record<UploadType, string> = {
  avatar: "image/jpeg,image/png,image/webp",
  document: "application/pdf",
  banner: "image/jpeg,image/png,image/webp",
};

export function FileUpload({ type, currentUrl, onSuccess, className, variant = "dropzone" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Preview untuk gambar
    if (type !== "document" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || ERROR_MESSAGES.UPLOAD_FILE);
        setPreview(currentUrl || null);
        return;
      }

      setUploadedUrl(data.url);
      toast.success(`${TYPE_LABELS[type]} berhasil diunggah!`);
      onSuccess?.(data.url);
    } catch {
      toast.error(ERROR_MESSAGES.UPLOAD_ERROR);
      setPreview(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const clearFile = () => {
    setPreview(null);
    setUploadedUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ---- Variant: Button (compact, untuk form registrasi PDF) ----
  if (variant === "button") {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[type]}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 border-dashed hover:border-primary/50 transition-colors">
          <div className="bg-blue-50 p-2.5 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            {uploadedUrl ? (
              <div className="flex items-center text-xs font-bold text-green-600">
                <Check className="w-3.5 h-3.5 mr-1.5" /> {UI_TEXT.DOCUMENT_UPLOADED}
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-400">{UI_TEXT.FILE_HINT}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="text-xs font-bold text-primary hover:text-sisc-auth"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : UI_TEXT.SELECT_FILE}
          </Button>
        </div>
      </div>
    );
  }

  // ---- Variant: Dropzone (default, untuk avatar & banner) ----
  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[type]}
        onChange={handleChange}
        className="hidden"
      />
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all
          ${isDragOver ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 bg-slate-50/50"}
          ${isUploading ? "pointer-events-none opacity-70" : ""}
          ${type === "avatar" ? "w-32 h-32 rounded-full overflow-hidden" : "w-full aspect-[16/9]"}
          flex items-center justify-center
        `}
      >
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            {!isUploading && (
              <Button
                variant="destructive"
                size="icon-xs"
                type="button"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="absolute top-2 right-2 z-10 rounded-full"
                aria-label="Hapus file"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            {type === "avatar" ? (
              <ImageIcon className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
            <span className="text-xs font-medium text-center px-2">
              {type === "avatar" ? "Upload Foto" : UI_TEXT.DROP_FILE_HERE}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
