import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const documents = await db.document.findMany({
      where: { status: "VIGENTE" },
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const {
      type,
      fileName,
      fileUrl,
      uploadDate,
      expiryDate,
      status,
      insurance,
      vehiclePlate,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await db.document.create({
      data: {
        userId,
        type,
        fileName,
        fileUrl,
        uploadDate,
        expiryDate,
        status,
        insurance,
        vehiclePlate,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.log("[DOCUMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
