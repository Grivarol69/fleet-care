import { Calendar, Car, Heart, Settings } from "lucide-react";

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
    subItems: [
      { label: "Listar Vehículos", href: "/dashboard/admin/cars-manager/list" },
      { label: "Agregar Vehículo", href: "/dashboard/admin/cars-manager/add" },
    ],
  },
  {
    icon: Settings,
    label: "Configuraciones",
    subItems: [
      { label: "Categorias", href: "/dashboard/admin/categories" },
      { label: "Marcas de Vehículos", href: "/dashboard/admin/brands" },
      { label: "Tipos de Vehículos", href: "/dashboard/admin/tipos" },
      { label: "Lineas de Vehículos", href: "/dashboard/admin/lines" },
    ],
  },
  {
    icon: Car,
    label: "Mantenimiento",
    href: "/dashboard/admin/maintenance",
  },
];
