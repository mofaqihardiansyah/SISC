import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Fake auth function
const auth = (req: Request) => ({ id: "fake-user-id" }); 

export const ourFileRouter = {
  // Define endpoint for image uploads
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Return data to be sent to the client-side onUploadComplete callback
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
