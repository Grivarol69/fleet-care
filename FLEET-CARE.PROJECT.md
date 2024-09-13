# Proyecto FleetCare - Plan de Mantenimiento

Proyecto de desarrollo de un plan de mantenimiento para el cuidado de la flota de Vehiculos

## Pasos e instalaciones

- Instalaciones iniciales

  - Proyecto Nextjs: "npx create-next-app@latest fleet-care --typescript --tailwind --eslint"
  - Instalar shadcn: "npx shadcn-ui@latest init"
  - Instalar Clerk.com y seguir los pasos
  - Para subir archivos e imagenes usar **UploadThing.com**
  - Armado del Dashboard

  # Estructura de carpetas

  - (auth)
    - sign-in // Ruta: http://localhost:3000/sign-in
    - sign-up // Ruta: http://localhost:3000/sign-up
  - (routes)
    - (dashboard)
      - dashboard
        - admin
          - cars-manager
            - page.tsx // Ruta: http://localhost:3000/dashboard/admin/cars-manager
            - layout.tsx **LayoutAdminCarsManager**
            - components
              - ButtonAddCar
                - Funcionalidad Dialog
              - FormAddCar
                - FormAddCar.tsx **formulario**
                - FormAddCar.form.ts **data validada con Zod**
              - ListCars **Listado de Coches**
                - ListCars.types.ts
                - ListCars.jsx
              - TableCars
                - TableCars.types.ts
                - TableCars.tsx
        - components
          - Sidebar
            - Sidebar.tsx
          - LogoDashboard
            - LogoDashboard.tsx
          - NavbarDashboard
            - NavbarDashboard.tsx
          - SidebarRoutes
            - SidebarRoutes.data.ts **contiene los items del menu de la sidebar**
            - SidebarRoutes.tsx **contenedor de items**
              - SidebarItem
                - SidebarItem.tsx
                - SidebarItem.types.ts **contiene los tipos de la Props**
        - page.tsx - **DashboardPage**
      - DashboardLayout - aca se define el **sidebar** y el **navbar**
    - (home)
    - page.tsx \*\*Página Principal
  - api
    - car **/api/car Endpoint donde se envia la data obtenida en el form para que guarde en la DB**

## Pasos para instalar Prisma

- npm install prisma
- npx prisma init
- npm install @prisma/client
- _Cómo buena práctica con Prisma y para evitar que se genera una nueva instancia de prisma/client con cada compilación se debe generar el siguiente código en /lib/db.ts_

```js
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
```

- Una vez realizadas las especificaciones de los modelos y sus relaciones correr
- npx prisma generate
- npx prisma db push - sube la estructura al servidor Neon

- Para trabajar con neon.tech crear un proyecto nuevo y copiar el snippet generado a **.env**
  ejemplo: **DATABASE_URL=postgresql://fleetcaredb_owner:5SRj4mtGoqwd@ep-super-salad-a5rcwkrs.us-east-2.aws.neon.tech/fleetcaredb?sslmode=require**

## _Código LayoutDashboard con clases Tailwind Sidebar y Navbar_

```js
return (
  <div className="flex w-full h-full bg-orange-600">
    <div className="hidden h-full xl:block w-80 xl:fixed bg-lime-200">
      Sidebar...
    </div>
    <div className="w-full h-full xl:ml-80 bg-orange-200">
      <div className="p-6 h-max bg-slate-500">{children}</div>
    </div>
  </div>
);
```

## Código Tailwind para armar un layout con sidebar, navbar, area de logo y area principal

```js

<div class="flex w-full h-full">
  <div class="h-full xl:block w-80 xl:fixed ">
    <div class="h-screen">
      <div class="flex flex-col h-full border-r">
        <div class="flex items-center h-20 gap-2 border-b cursor-pointer min-h-20 px-6">
          Logo
        </div>
        <div class="flex flex-col justify-between h-full ">
          SidebarRoutes
        </div>
      </div>

    </div>
  </div>

  <div class="w-full h-full xl:ml-80 ">
    <!-- comienzo bloque Navbar Dashboard -->
    <div class="flex items-center justify-between w-full h-20 px-2 border-b gap-x-4 md:px-6 bg-background">
      <div class="block xl:hidden">
        Navbar Dashboard
      </div>
    </div>
    <!-- Pantalla Principal -->
    <div class="p-6 h-max">
      Pantalla Principal
    </div>
  </div>
</div>
```

## Mecanismo para resaltar un item activo del sidebar

```js
  const pathname = usePathname();
  const activePath = pathname === href;
  //* Si coincide el path de la pagina con el href del item se pinta de "bg-slate-400/20"
  //* cn permite integrar estilos condicionales

  <Link
      href={href}
      className={cn(
        `flex gap-x-2 text-slate-700 text-sm items-center hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer`,
        activePath && "bg-slate-400/20"
      )}
    >
```

## Importante - llamamos a SidebarRoutes (componente que carga los items del menu lateral) tanto en la Sidebar cómo en la NavbarDashboard de tal manera que dentro del sheet (pantalla colapsible) aparezca tambien los items del menu lateral

```js
<Sheet>
  <SheetTrigger className="flex items-center">
    <Menu />
  </SheetTrigger>
  <SheetContent side="left">
    <SidebarRoutes /> //Este componente carga los items del menu lateral
  </SheetContent>
</Sheet>
```

## Estructura de un Form con componentes de Shadcn (Form, Input, Select, Toast)

Se define en un archivo aparte (FormAddCar.form.ts) la estructura de datos a validar con Zod

```js
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2).max(50),
  cv: z.string().min(2).max(50),
  transmission: z.string().min(2).max(50),
  people: z.string().min(2),
  photo: z.string().min(2).max(50),
  engine: z.string().min(2).max(50),
  type: z.string().min(2).max(50),
  priceDay: z.string().min(2).max(50),
  isPublish: z.boolean(),
});
```

Esta estructura se importa al Form para definir el Schema de Zod, del lado del form se crea una instancia del formSchema que contiene la data necesaria

```js
const form =
  useForm <
  z.infer <
  typeof formSchema >>
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        cv: "",
        transmission: "",
        people: "",
        photo: "",
        engine: "",
        type: "",
        priceDay: "",
        isPublish: false,
      },
    };
```

## Control para subir imagenes con UploadThing

Luego de las configuraciones que vienen en la instalación colocar el siguiente componente para subir imagenes

```js
<FormField
  control={form.control}
  name="photo"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Car Image</FormLabel>
      <FormControl>
        {photoUploaded ? (
          <p className="text-sm">Image uploaded!</p>
        ) : (
          <UploadButton
            className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
            {...field}
            endpoint="photo"
            onClientUploadComplete={(res) => {
              form.setValue("photo", res?.[0].url);
              setPhotoUploaded(true);
            }}
            onUploadError={(error: Error) => {
              console.log(error);
            }}
          />
        )}
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Controlar que todos los campos del form esten llenos

```js
const { isValid } = form.formState;

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      ---
    </form>
  </Form>
);
```

luego en el boton submit

```js
<Button type="submit" className="w-full mt-5" disabled={!isValid}>
  Create Car
</Button>
```

## Mecanismo para cerrar el Dialog de Shadcn

Recordar que el componente **ButtonAddCar** llama a FormAddCar y le pasa cómo props **setOpenDialog**
esta función del useState primero se define su tipo en FormAddCarProps de acuerdo al siguiente código:

```js
import { Dispatch, SetStateAction } from "react";

export type FormAddCarProps = {
  setOpenDialog: Dispatch<SetStateAction<boolean>>,
};
```

Una vez destructurada **setOpenDialog** de Props en el form se llama en la funcion **Submit** colocandola en **false**, cambiando el estado openDialog en su componente padre **ButtonAddCar** cuyo componente Dialog tiene una propiedad open={openDialog} que cierra el Modal cuando openDialog esta en false

## Mecanismo para guardar los datos del Form en la base de datos

Función Submit del Form

```js
try {
  await axios.post(`/api/car`, values);
  toast({
    title: "Car created!",
  });

  router.refresh();
} catch (error) {
  toast({
    title: "Something went wrong",
    variant: "destructive",
  });
}
```

donde con Axios se envia los values al endpoint /api/car por metodo POST
En el endpoint http:localhost:300/api/car se encuentra el archivo **route.ts** que contiene el siguiente código:

```js
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const car = await db.car.create({
      data: {
        userId,
        ...data,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.log("[CAR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

donde se obtienen los datos de la request invocada por axios.post(values) y se crea el registro en la DB
