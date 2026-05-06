"use client";

import React from "react";
import { FileUpload } from "./FileUpload";
import { updateEventBanner } from "@/lib/actions/event";

interface ImageUploadProps {
  eventId: number;
  onUploadSuccess?: (url: string) => void;
}

export function ImageUpload({ eventId, onUploadSuccess }: ImageUploadProps) {
  return (
    <FileUpload
      type="banner"
      onSuccess={async (url) => {
        const result = await updateEventBanner(eventId, url);
        if (result.success) {
          onUploadSuccess?.(url);
        }
      }}
    />
  );
}
