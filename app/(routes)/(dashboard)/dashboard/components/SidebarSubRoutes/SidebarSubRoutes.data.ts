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
    href: "/dashboard",
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
      { label: "Listado Vehículos", href: "/vehicles/fleet" },
      { label: "Marcas", href: "/vehicles/brands" },
      { label: "Líneas", href: "/vehicles/lines" },
      { label: "Tipos", href: "/vehicles/types" },
      { label: "Vehiculos de la Empresa", href: "/vehicles/vehicles" },
      { label: "Documentos Obligatorios", href: "/vehicles/documents" },
    ],
  },
  {
    icon: Wrench,
    label: "Mantenimiento",

    subItems: [
      { label: "Categorias", href: "/mantenaince/mant-categories" },
      { label: "Items", href: "/mantenaince/mant-items" },
      { label: "Planes", href: "/mantenaince/mant-plan" },
      { label: "Tareas", href: "/mantenaince/plan-tasks" },
      { label: "Vehiculos-Plan", href: "/mantenaince/plan-vehicles" },
      { label: "Ordenes de Trabajo", href: "/mantenaince/work-orders" },
      {
        label: "Tareas Orden de Trabajo",
        href: "/mantenaince/items-workorders",
      },
      { label: "Items-Proveedores", href: "/people/mant-item-provider" },
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
      { label: "Mecánicos", href: "/people/technicians" },
      { label: "Conductores", href: "/personal/conductores" },
      { label: "Agregar", href: "/personal/agregar" },
    ],
  },
  {
    icon: ShoppingBag,
    label: "Proveedores",
    subItems: [
      { label: "Listado", href: "/proveedores/listado" },
      { label: "Agregar", href: "/people/providers" },
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
    subItems: [
      { label: "Tenant", href: "/admin/tenant" },
      { label: "User", href: "/admin/user" },
      { label: "Role", href: "/admin/role" },
      { label: "Permission", href: "/admin/permission" },
      { label: "Role-Permission", href: "/admin/role-permission" },
      { label: "Estado Flota", href: "/reportes/estado-flota" },
      {
        label: "Eficiencia",
        href: "/reportes/eficiencia-mantenimiento",
      },
    ],
  },
];
