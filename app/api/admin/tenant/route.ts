import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schema de validación para los datos del tenant
const tenantSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  domain: z.string().min(1, "El dominio es requerido"),
  photo: z.string().min(1, "La foto es requerida"),
  rut_nit: z.string().min(1, "El RUT/NIT es requerido"),
});

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tenants = await db.tenant.findMany();
    return NextResponse.json(tenants);
  } catch (error) {
    console.error("[TENANTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Verificar autenticación
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Obtener y validar los datos del body
    const body = await req.json();
    console.log("Received POST data:", body); // Para debugging

    const validationResult = tenantSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Validation error",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { name, domain, photo, rut_nit } = validationResult.data;

    // Verificar si ya existe un tenant con el mismo dominio
    const existingTenant = await db.tenant.findFirst({
      where: { domain },
    });

    if (existingTenant) {
      return new NextResponse(
        JSON.stringify({
          error: "Domain already exists",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Crear el nuevo tenant
    const tenant = await db.tenant.create({
      data: {
        name,
        domain,
        photo,
        rut_nit,
      },
    });

    console.log("Created tenant:", tenant); // Para debugging

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("[TENANTS_POST]", error);

    // Manejar errores específicos de la base de datos
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({
          error: "Database Error",
          message: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
