"use client";

import { useEffect, useState } from "react";
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
import { formSchema } from "./FormAddLine.form";
import { FormAddLineProps } from "./FormAddLine.types";

type VehicleBrand = {
  id: number;
  name: string;
};

export function FormAddLine({
  isOpen,
  setIsOpen,
  onAddLine,
}: FormAddLineProps) {
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brandId: 0,
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/vehicles/lines`, values);

      const newLine = response.data;

      onAddLine(newLine); // Update the UI with the new line
      setIsOpen(false);
      form.reset();
      toast({
        title: "Linea de Vehículo creada!",
        description: "Una nueva Linea fue creada!",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Linea</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Name description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
