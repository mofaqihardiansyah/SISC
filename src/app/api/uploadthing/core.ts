import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UPLOAD_LIMITS } from "@/lib/constants";

const f = createUploadthing();

// Fake auth function
const auth = (req: Request) => ({ id: "fake-user-id" }); 

export const ourFileRouter = {
  // Define endpoint for image uploads
  imageUploader: f({ 
    image: { 
      maxFileSize: UPLOAD_LIMITS.MAX_FILE_SIZE, 
      maxFileCount: UPLOAD_LIMITS.MAX_FILE_COUNT 
    } 
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Define endpoint for PDF/Document uploads
  pdfUploader: f({ 
    pdf: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
