import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import {
//   generateUploadButton,
//   generateUploadDropzone,
// } from "@uploadthing/react";

// const f = createUploadthing();

// // FileRouter para tu aplicación
// export const ourFileRouter = {
//   imageOrDocument: f({
//     image: { maxFileSize: "4MB" },
//     pdf: { maxFileSize: "4MB" },
//   })
//     .middleware(() => {
//       // No hay lógica de autenticación aquí
//       return {};
//     })
//     .onUploadComplete(({ file }) => {
//       console.log("Archivo subido:", file.name);
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;

// export const UploadButton = generateUploadButton<OurFileRouter>();
// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "../api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
