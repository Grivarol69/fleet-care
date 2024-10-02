"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

import { useRouter } from "next/navigation";
import { formSchema } from "./FormAddModel.form";
import { FormAddModelProps } from "./FormAddModel.types";

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

export function FormAddModel({
  isOpen,
  setIsOpen,
  onAddModel,
}: FormAddModelProps) {
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleLines, setVehicleLines] = useState<VehicleLine[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandId: 0,
      lineId: 0,
      typeId: 0,
      year: 0,
      engine: "",
      wheels: 0,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* fetch Brands of Vehicles from Database

  useEffect(() => {
    const fetchingBrands = async () => {
      try {
        const response = await axios.get(`/api/vehicles/brands`);
        setVehicleBrands(response.data);
      } catch (error) {
        console.log("Error al cargar las marcas de vehículos", error);
      }
    };

    fetchingBrands();
  }, []);

  //* fetch Lines of Vehicles from Database

  useEffect(() => {
    const fetchingLines = async () => {
      try {
        const response = await axios.get(`/api/vehicles/lines`);
        setVehicleLines(response.data);
      } catch (error) {
        console.log("Error al cargar las lineas", error);
      }
    };

    fetchingLines();
  }, []);

  //* fetch Types of Vehicles from Database

  useEffect(() => {
    const fetchingTypes = async () => {
      try {
        const response = await axios.get(`/api/vehicles/types`);
        setVehicleTypes(response.data);
      } catch (error) {
        console.log("Error al cargar los tipos de vehículos", error);
      }
    };

    fetchingTypes();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedValues = {
        ...values,
        brandId: Number(values.brandId),
        lineId: Number(values.lineId),
        typeId: Number(values.typeId),
        year: Number(values.year),
        wheels: Number(values.wheels),
      };
      console.log(formattedValues);
      const response = await axios.post(
        `/api/vehicles/model-vehicles`,
        formattedValues
      );

      const newModel = response.data;

      onAddModel(newModel); // Update the UI with the new model
      setIsOpen(false);
      form.reset();
      toast({
        title: "Model create!",
        description: "A new model was created",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Marca</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Carga de Marcas ---------------*/}

            <FormField
              control={form.control}
              name="brandId"
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

            {/* ------------ Carga de Lineas ---------------*/}

            <FormField
              control={form.control}
              name="lineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Linea de Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
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

            {/* ------------ Carga de Types ---------------*/}

            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipos de Vehículo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
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

            {/* --------- año del vehiculo -------------*/}

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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* --------------- Tipo de Combustible ------------------- */}

            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Motor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo de combustible" />
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

            {/* --------------- Cantidad de Ruedas ------------------- */}

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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Crear Modelo</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
