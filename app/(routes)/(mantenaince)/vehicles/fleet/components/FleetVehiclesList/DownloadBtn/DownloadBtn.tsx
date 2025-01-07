import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide } from "lucide-react";
import { VehicleListProps } from "../VehiclesList.types";
import * as XLSX from "xlsx";

type DownloadBtnProps = {
  data: VehicleListProps[];
  fileName: string;
};

export function DownloadBtn({ data = [], fileName }: DownloadBtnProps) {
  return (
    <Button
      className="flex items-center justify-between"
      onClick={() => {
        const datas = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(datas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
      }}
    >
      <ArrowDownNarrowWide />
      Descargar a Excel
    </Button>
  );
}
