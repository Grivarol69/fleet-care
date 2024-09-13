import { LucideIcon } from "lucide-react";

type SubItem = {
  label: string;
  href: string;
};

export type SidebarSubItemProps = {
  item: {
    label: string;
    icon: LucideIcon;
    href?: string;
    subItems?: SubItem[];
  };
};
