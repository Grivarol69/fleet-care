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
import { UploadButton } from "@/app/utils/uploadthing";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormAddVehicles.form";
import { ModelSelectModal } from "../ModelSelectModal";
import { FormAddVehicleProps, ModelVehicle } from "./FormAddVehicles.types";

export function FormAddVehicle({
  isOpen,
  setIsOpen,
  onAddVehicle,
}: FormAddVehicleProps) {
  const [vehicleModels, setVehicleModels] = useState<ModelVehicle[]>([]);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelVehicle | null>(null);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelVehicleId: 0,
      photo: "",
      licensePlate: "",
      typePlate: "",
      mileage: 0,
      color: "",
      owner: "",
      year: 0,
      situation: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* Traemos los modelos para forzar el lookup de Modelos

  useEffect(() => {
    const fetchModelVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles/model-vehicles");
        setVehicleModels(response.data);
      } catch (error) {
        console.error("Error fetching model vehicles:", error);
        toast({
          title: "Error fetching model vehicles",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchModelVehicles();
  }, [toast]);

  const handleModelSelect = (model: ModelVehicle) => {
    setSelectedModel(model);
    form.setValue("modelVehicleId", model.id);
    setIsModelSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const formattedValues = {
        ...values,
        modelVehicleId: Number(values.modelVehicleId),
        photo: String(values.photo),
        licensePlate: String(values.licensePlate).toUpperCase(),
        typePlate: String(values.typePlate),
        mileage: Number(values.mileage),
        color: String(values.color).toUpperCase(),
        owner: String(values.owner),
        year: Number(values.year),
        situation: String(values.situation),
      };

      console.log("Valores formateados", formattedValues);

      const response = await axios.post(
        `/api/vehicles/vehicles`,
        formattedValues
      );
      const newVehicle = response.data;
      onAddVehicle(newVehicle); // Update the UI with the new vehicle
      setIsOpen(false);
      form.reset();
      toast({
        title: "Vehicle create!",
        description: "A new vehicle was created",
      });
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Ocurrió un error",
          description: error.response?.data || "No se pudo crear el vehículo",
          variant: "destructive",
        });
      } else {
        console.error("Error al crear el vehículo:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Vehiculo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Carga de Modelos ---------------*/}

            <FormField
              control={form.control}
              name="modelVehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo Vehículo</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="ID del modelo"
                        {...field}
                        value={selectedModel ? selectedModel.id : field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        type="number"
                        readOnly
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsModelSelectOpen(true)}
                    >
                      Buscar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* --------- Placa Vehículo -------------*/}

              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa Vehículo</FormLabel>
                    <FormControl>
                      <Input placeholder="Placa Vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Tipo de Placa ---------------*/}

              <FormField
                control={form.control}
                name="typePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Placa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Tipo de Placa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AMARILLA">Amarilla</SelectItem>
                        <SelectItem value="BLANCA">Blanca</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------------- kILOMETRAJE ------------------- */}

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cantidad de Kilometros"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------------- COLOR ------------------- */}

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Color del vehículo"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------------- Propietario del Vehículo ------------------- */}

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Propietario</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de Propietario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PROPIO">Propio</SelectItem>
                        <SelectItem value="NO_PROPIO">No Propio</SelectItem>
                        <SelectItem value="TERCERO">Tercero</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------------- Estado del Vehículo ------------------- */}

              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado del vehículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                        <SelectItem value="RENTADO">Rentado</SelectItem>
                        <SelectItem value="MANTENIMIENTO">
                          Mantenimiento
                        </SelectItem>
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

              {/* ------------ Fotografía ---------------*/}

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen Vehículo</FormLabel>
                    <FormControl>
                      {photoUploaded ? (
                        <h3 className="text-sm">Image uploaded!</h3>
                      ) : (
                        <UploadButton
                          className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                          {...field}
                          endpoint="photo"
                          onClientUploadComplete={(res) => {
                            form.setValue("photo", res?.[0].url);
                            setPhotoUploaded(true);
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error);
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Crear Modelo</Button>
          </form>
        </Form>
      </DialogContent>
      <ModelSelectModal
        isOpen={isModelSelectOpen}
        setIsOpen={setIsModelSelectOpen}
        models={vehicleModels}
        onSelectModel={handleModelSelect}
      />
    </Dialog>
  );
}
