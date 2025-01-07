"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./Odometer.form";
import { FormAddOdometerProps, VehicleProps } from "./Odometer.types";
import { cn } from "@/lib/utils";

import { VehicleSelectModal } from "./VehicleSelectModal";

export function Odometer() {
  const [isOpen, setIsOpen] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProps | null>(
    null
  );
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePlate: "",
      kilometers: 0,
      recordedAt: new Date(),
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* Traemos los vehiculos para forzar el lookup

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Error fetching vehicles",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchVehicles();
  }, [toast]);

  const handleVehicleSelect = (model: VehicleProps) => {
    setSelectedVehicle(model);
    form.setValue("vehiclePlate", model.licensePlate);
    setIsVehicleSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const odometerData = {
        vehiclePlate: values.vehiclePlate,
        kilometers: Number(values.kilometers),
        recordedAt: new Date(),
      };

      const response = await axios.post(`/api/vehicles/odometer`, odometerData);
      console.log(response.data);

      setIsOpen(false);
      form.reset();
      toast({
        title: "Odometer creado!",
        description: "Un nuevo Odometer fue creado!",
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
    <>
      <Button onClick={() => setIsOpen(true)}>Agregar Odómetro</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Odómetro</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* ------------ Place Vehiculo --------------- */}

              <FormField
                control={form.control}
                name="vehiclePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa Vehículo</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="Placa del Vehiculo"
                          {...field}
                          value={
                            selectedVehicle
                              ? selectedVehicle.licensePlate
                              : field.value
                          }
                          // onChange={(e) => field.onChange(Number(e.target.value))}
                          // type="string"
                          readOnly
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => setIsVehicleSelectOpen(true)}
                      >
                        Buscar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Número Documento ---------------*/}

              <FormField
                control={form.control}
                name="kilometers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometros</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese kilometraje"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Enviar</Button>
            </form>
          </Form>
        </DialogContent>
        <VehicleSelectModal
          isOpen={isVehicleSelectOpen}
          setIsOpen={setIsVehicleSelectOpen}
          vehicles={vehicles}
          onSelectVehicle={handleVehicleSelect}
        />
      </Dialog>
    </>
  );
}
