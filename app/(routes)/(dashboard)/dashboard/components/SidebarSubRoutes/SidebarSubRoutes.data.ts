import {
  LayoutDashboard,
  Building2,
  Truck,
  Wrench,
  ClipboardCheck,
  Users,
  ShoppingBag,
  BarChart2,
  Settings,
  Info,
  Map,
  List,
  PlusCircle,
  Package,
  CheckSquare,
  History,
  UserPlus,
  FileText,
  TrendingUp,
} from "lucide-react";

export const dataAdminSidebar = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Building2,
    label: "Empresa",
    subItems: [
      { label: "Información", href: "/empresa/informacion" },
      {
        label: "Configuración",
        icon: Settings,
        href: "/empresa/configuracion",
      },
      { label: "Sucursales", href: "/empresa/sucursales" },
    ],
  },
  {
    icon: Truck,
    label: "Vehículos",
    subItems: [
      { label: "Listado", href: "/dashboard/admin/cars-manager" },
      { label: "Marcas", href: "/dashboard/admin/brands" },
      { label: "Tipos", href: "/dashboard/admin/types" },
      { label: "Líneas", href: "/dashboard/admin/lines" },
      {
        label: "Modelos de Vehículos",
        href: "/dashboard/admin/model-vehicles",
      },
      { label: "Vehiculos de la Empresa", href: "/dashboard/admin/vehicles" },
    ],
  },
  {
    icon: Wrench,
    label: "Mantenimiento",

    subItems: [
      { label: "Paquetes", href: "/dashboard/admin/maintenance/paquetes" },
      { label: "Tareas", href: "/dashboard/admin/maintenance/tareas" },
      { label: "Ítems", href: "/dashboard/admin/maintenance/items" },
      { label: "Programar", href: "/dashboard/admin/maintenance/programar" },
      { label: "Historial", href: "/dashboard/admin/maintenance/historial" },
    ],
  },
  {
    icon: ClipboardCheck,
    label: "Checklist",
    subItems: [
      { label: "Crear", href: "/checklist/crear" },
      {
        label: "Inspeccionar",
        href: "/checklist/inspeccionar",
      },
      { label: "Historial", href: "/checklist/historial" },
    ],
  },
  {
    icon: Users,
    label: "Personal",
    subItems: [
      { label: "Mecánicos", href: "/personal/mecanicos" },
      { label: "Conductores", href: "/personal/conductores" },
      { label: "Agregar", href: "/personal/agregar" },
    ],
  },
  {
    icon: ShoppingBag,
    label: "Proveedores",
    subItems: [
      { label: "Listado", href: "/proveedores/listado" },
      { label: "Agregar", href: "/proveedores/agregar" },
      { label: "Categorías", href: "/proveedores/categorias" },
    ],
  },
  {
    icon: BarChart2,
    label: "Reportes",
    subItems: [
      { label: "Costos", href: "/reportes/costos-mantenimiento" },
      { label: "Estado Flota", href: "/reportes/estado-flota" },
      {
        label: "Eficiencia",
        href: "/reportes/eficiencia-mantenimiento",
      },
    ],
  },
  {
    icon: Settings,
    label: "Configuración",
    href: "/configuracion",
  },
];
