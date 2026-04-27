"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateEventBanner } from "@/lib/actions/event";
import { toast } from "sonner"; // Assuming sonner is used for notifications, if not I'll use alert

interface ImageUploadProps {
  eventId: number;
  onUploadSuccess?: (url: string) => void;
}

export function ImageUpload({ eventId, onUploadSuccess }: ImageUploadProps) {
  return (
    <div className="w-full">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          if (res && res[0]) {
            const url = res[0].url;
            const result = await updateEventBanner(eventId, url);
            
            if (result.success) {
              if (onUploadSuccess) onUploadSuccess(url);
              toast.success("Banner berhasil diunggah dan disimpan!");
            } else {
              toast.error(result.error || "Gagal menyimpan banner.");
            }
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`UPLOAD ERROR: ${error.message}`);
        }}
        className="ut-label:text-blue-600 ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-500"
      />
    </div>
  );
}
