import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

import { formSchema } from "./FormAddMantPlan.form";
import { FormAddMantPlanProps } from "./FormAddMantPlan.types";

type VehicleBrand = {
  id: number;
  name: string;
};

type VehicleLine = {
  id: number;
  name: string;
};

export function FormAddMantPlan({
  isOpen,
  setIsOpen,
  onAddMantPlan,
}: FormAddMantPlanProps) {
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleLines, setVehicleLines] = useState<VehicleLine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      vehicleBrandId: 0,
      vehicleLineId: 0,
      tenantId: "", // ID hardcodeado del tenant
    },
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`/api/vehicles/brands`);
        setVehicleBrands(response.data);
      } catch (error) {
        console.error("Error al cargar las marcas de vehículos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las marcas de vehículos",
          variant: "destructive",
        });
      }
    };

    fetchBrands();
  }, [toast]);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await axios.get(`/api/vehicles/lines`);
        setVehicleLines(response.data);
      } catch (error) {
        console.error("Error al cargar las líneas:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las líneas de vehículos",
          variant: "destructive",
        });
      }
    };

    fetchLines();
  }, [toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting values:", values); // Para debugging

      const response = await axios.post(`/api/mantenaince/mant-plan`, {
        description: values.description,
        vehicleBrandId: Number(values.vehicleBrandId),
        vehicleLineId: Number(values.vehicleLineId),
        tenantId: values.tenantId,
      });

      console.log("Response:", response.data); // Para debugging

      onAddMantPlan(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "¡Éxito!",
        description: "Plan de mantenimiento creado correctamente",
      });

      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el plan de mantenimiento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción:</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del plan" {...field} />
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
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una marca" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
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
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una línea" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleLines.map((line) => (
                        <SelectItem key={line.id} value={line.id.toString()}>
                          {line.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
