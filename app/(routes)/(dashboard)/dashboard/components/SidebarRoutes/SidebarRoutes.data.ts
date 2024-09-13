import { Calendar, Car, Heart } from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: Car,
    label: "Vehículos de la Empresa",
    href: "/dashboard",
  },
  {
    icon: Calendar,
    label: "CheckList",
    href: "/calendar",
  },
  {
    icon: Heart,
    label: "Novedades",
    href: "/loved-cars",
  },
];

export const dataAdminSidebar = [
  {
    icon: Car,
    label: "Administración Vehículos",
    href: "/dashboard/admin/cars-manager",
  },
  {
    icon: Calendar,
    label: "Categorias",
    href: "/dashboard/admin/categories",
  },
  {
    icon: Calendar,
    label: "Marcas de Vehículos",
    href: "/dashboard/admin/brands",
  },
  {
    icon: Calendar,
    label: "Tipos de Vehículos",
    href: "/dashboard/admin/tipos",
  },
  {
    icon: Calendar,
    label: "Lineas de Vehículos",
    href: "/dashboard/admin/lines",
  },
];
