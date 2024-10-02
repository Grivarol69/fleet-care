"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { formSchema } from "./FormEditModel.form";
import { useRouter } from "next/navigation";
import { FormEditModelProps } from "./FormEditModel.types";
import { useEffect, useState } from "react";

type VehicleBrand = {
  id: number;
  name: string;
};

type VehicleLine = {
  id: number;
  name: string;
};

type VehicleType = {
  id: number;
  name: string;
};

export function FormEditModel({
  isOpen,
  setIsOpen,
  model,
  onEditModel,
}: FormEditModelProps) {
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleLines, setVehicleLines] = useState<VehicleLine[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandId: model.brandId,
      lineId: model.lineId,
      typeId: model.typeId,
      year: model.year,
      engine: model.engine,
      wheels: model.wheels,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, linesRes, typesRes] = await Promise.all([
          axios.get(`/api/vehicles/brands`),
          axios.get(`/api/vehicles/lines`),
          axios.get(`/api/vehicles/types`),
          // axios.get(`/api/vehicles/model-vehicles/${id}`),
        ]);

        setVehicleBrands(brandsRes.data);
        setVehicleLines(linesRes.data);
        setVehicleTypes(typesRes.data);

        // Set form values with the current model data
        // form.reset(modelRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the vehicle data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/vehicles/model-vehicles/${model.id}`,
        values
      );
      const updatedModel = response.data;
      onEditModel(updatedModel);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Model updated",
        description: "Model was updated succesfully!",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating model:", error);
      toast({
        title: "Error updating model",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Marca</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Select de Marcas ----------- */}

            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca de Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
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

            {/* ------------ Select de Lineas ----------- */}

            <FormField
              control={form.control}
              name="lineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linea de Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una Linea" />
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

            {/* ------------ Select de Tipos ----------- */}

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipos de Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un Tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Año del modelo ----------- */}

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo Año</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Año del vehículo"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Engine ----------- */}

            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Motor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo de motor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GASOLINA">GASOLINA</SelectItem>
                      <SelectItem value="DIESEL">DIESEL</SelectItem>
                      <SelectItem value="ACPM">ACPM</SelectItem>
                      <SelectItem value="GNV">GNV</SelectItem>
                      <SelectItem value="ELECTRICO">ELECTRICO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Wheels ----------- */}

            <FormField
              control={form.control}
              name="wheels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Ruedas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cantidad de Ruedas"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Actualizar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
