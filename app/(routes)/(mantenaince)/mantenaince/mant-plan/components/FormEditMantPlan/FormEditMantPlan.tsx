import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormEditMantPlanProps, MantPlan } from "./FormEditMantPlan.types";
import { PlanTasksList } from "./components/PlanTasksList";

type Brand = {
  id: number;
  name: string;
};

type Line = {
  id: number;
  name: string;
};

export default function FormEditMantPlan({
  isOpen,
  setIsOpen,
  item,
  onEditMantPlan,
}: FormEditMantPlanProps) {
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicleLines, setVehicleLines] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      id: item.id,
      tenantId: item.tenantId,
      description: item.description,
      vehicleBrandId: item.vehicleBrandId,
      vehicleLineId: item.vehicleLineId,
      status: item.status,
    },
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`/api/vehicles/brands`);
        setVehicleBrands(response.data);
      } catch (error) {
        console.log("Error al cargar las marcas de vehículos", error);
      }
    };

    const fetchLines = async () => {
      try {
        const response = await axios.get(`/api/vehicles/lines`);
        setVehicleLines(response.data);
      } catch (error) {
        console.log("Error al cargar las líneas", error);
      }
    };

    fetchBrands();
    fetchLines();
  }, []);

  const onSubmit = async (values: MantPlan) => {
    try {
      const response = await axios.post(
        `/api/mantenaince/mant-plan/${item.id}`,
        values
      );
      onEditMantPlan(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "El Plan fue actualizado!",
        description: "El plan fue actualizado exitosamente!",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Algo salió mal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Plan</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalles del Plan</TabsTrigger>
              <TabsTrigger value="tasks">Tareas del Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción:</FormLabel>
                        <FormControl>
                          <Input placeholder="Descripción" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleBrandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca de Vehículo</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una marca" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleBrands.map((brand: Brand) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleLineId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Línea de Vehículo</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una Línea" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleLines.map((line: Line) => (
                              <SelectItem
                                key={line.id}
                                value={line.id.toString()}
                              >
                                {line.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Guardar Cambios</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="tasks" className="mt-4">
              <div className="min-h-[600px]">
                <PlanTasksList planId={item.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
