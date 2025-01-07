"use client";

import React, { useEffect, useState } from "react";
import { ItemWorkOrdersList } from "./components/ItemWorkOrdersList";
import { WorkOrder } from "./components/SharedTypes/SharedTypes";
import { WorkOrderSelectModal } from "./components/WorkOrderSelectModal/WorkOrderSelectModal";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ItemsWorkOrderPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null
  );
  const [isWorkOrderSelectOpen, setIsWorkOrderSelectOpen] = useState(false);
  const [workOrderId, setWorkOrderId] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get(`/api/mantenaince/work-order`);
        setWorkOrders(response.data);
      } catch (error) {
        console.error("Error fetching WorkOrders:", error);
        toast({
          title: "Error fetching WorkOrders",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchWorkOrders();
  }, [toast]);

  const handleWorkOrderSelect = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setWorkOrderId(workOrder.id);
    setIsWorkOrderSelectOpen(false);
  };

  return (
    <div className="container md:min-w-max mx-auto py-1">
      <h1 className="text-2xl font-bold mb-5">
        Lista de Items de Ordenes de Trabajo
      </h1>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="ID Work Order"
            value={selectedWorkOrder ? selectedWorkOrder.id : workOrderId}
            className="w-[150px]"
            readOnly
          />
          <Input
            placeholder="Vehículo Seleccionado"
            value={
              selectedWorkOrder
                ? `${selectedWorkOrder.brandName} - ${selectedWorkOrder.vehiclePlate} - ${selectedWorkOrder.otstatus}`
                : ""
            }
            className="flex-1"
            readOnly
          />
          <Button
            type="button"
            onClick={() => setIsWorkOrderSelectOpen(true)}
            className="w-[100px]"
          >
            Buscar
          </Button>
        </div>
      </div>

      <WorkOrderSelectModal
        isOpen={isWorkOrderSelectOpen}
        setIsOpen={setIsWorkOrderSelectOpen}
        workorder={workOrders}
        onSelectWorkOrder={handleWorkOrderSelect}
      />

      {selectedWorkOrder && <ItemWorkOrdersList workOrderId={workOrderId} />}

      {!selectedWorkOrder && (
        <div className="mt-8 text-center text-gray-500">
          Seleccione una orden de trabajo para ver sus items
        </div>
      )}
    </div>
  );
}
