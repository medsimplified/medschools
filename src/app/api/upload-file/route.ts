import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  console.log("🔥 Upload endpoint hit");

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📤 Uploading file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine if file is a PDF
    const isPDF =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    console.log(`📄 File is PDF: ${isPDF}, using resource_type: ${isPDF ? "raw" : "auto"}`);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: isPDF ? "raw" : "auto", // CRITICAL: Use 'raw' for PDFs
          folder: "", // No folder to simplify URL structure
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Upload successful:", {
              url: result?.secure_url,
              resource_type: result?.resource_type,
              format: result?.format,
              public_id: result?.public_id,
            });
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Verify the URL contains /raw/upload/ for PDFs
    if (isPDF && !result.secure_url.includes("/raw/upload/")) {
      console.error(
        "⚠️ PDF uploaded but URL does not contain /raw/upload/. URL:",
        result.secure_url
      );
      console.error("⚠️ Resource type was:", result.resource_type);
    } else if (isPDF) {
      console.log("✅ PDF URL verified with /raw/upload/");
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      {
        error: "File upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}