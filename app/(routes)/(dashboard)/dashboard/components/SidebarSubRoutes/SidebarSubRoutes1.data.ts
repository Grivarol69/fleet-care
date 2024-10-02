import { Calendar, Car, Heart, Settings } from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: Car,
    label: "Vehículos de la Empresa",
    href: "/dashboard/admin/vehicles",
  },
  {
    icon: Calendar,
    label: "Modelos",
    href: "/dashboard/admin/modelvehicles",
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
      { label: "Agregar Car", href: "/dashboard/admin/cars-manager" },
      { label: "Agregar Modelo", href: "/dashboard/admin/model-vehicles" },
      { label: "Agregar Vehiculo", href: "/dashboard/admin/vehicles" },
    ],
  },
  {
    icon: Settings,
    label: "Configuraciones",
    subItems: [
      { label: "Categorias", href: "/dashboard/admin/categories" },
      { label: "Marcas de Vehículos", href: "/dashboard/admin/brands" },
      { label: "Tipos de Vehículos", href: "/dashboard/admin/types" },
      { label: "Lineas de Vehículos", href: "/dashboard/admin/lines" },
    ],
  },
  {
    icon: Car,
    label: "Mantenimiento",
    href: "/dashboard/admin/maintenance",
  },
];
