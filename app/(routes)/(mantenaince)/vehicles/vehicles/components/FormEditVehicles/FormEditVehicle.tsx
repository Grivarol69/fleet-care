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
// import { UploadButton } from "@/app/utils/uploadthing";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { formSchema } from "./FormEditVehicle.form";
import { useRouter } from "next/navigation";
import { FormEditVehicleProps } from "./FormEditVehicle.types";
import { useEffect, useState } from "react";
import { ModelSelectModal } from "../ModelSelectModal";
import { useUploadThing } from "@/app/utils/uploadthing";

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

export function FormEditVehicle({
  isOpen,
  setIsOpen,
  vehicle,
  onEditVehicle,
}: FormEditVehicleProps) {
  // const [vehicleModels, setVehicleModels] = useState<ModelVehicle[]>([]);
  // const [selectedModel, setSelectedModel] = useState<ModelVehicle | null>(null);
  const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleLines, setVehicleLines] = useState<VehicleLine[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const { startUpload } = useUploadThing("imageOrDocument");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: vehicle.id,
      photo: vehicle.photo,
      licensePlate: vehicle.licensePlate,
      typePlate: vehicle.typePlate,
      brandId: vehicle.brandId,
      lineId: vehicle.lineId,
      typeId: vehicle.typeId,
      mileage: vehicle.mileage,
      cylinder: vehicle.cylinder,
      bodyWork: vehicle.bodyWork,
      engineNumber: vehicle.engineNumber,
      chasisNumber: vehicle.chasisNumber,
      ownerCard: vehicle.ownerCard,
      color: vehicle.color,
      owner: vehicle.owner,
      year: vehicle.year,
      situation: vehicle.situation,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  // //* Traemos los modelos para forzar el lookup de Modelos

  // useEffect(() => {
  //   const fetchModelVehicles = async () => {
  //     try {
  //       const response = await axios.get("/api/vehicles/model-vehicles");
  //       setVehicleModels(response.data);
  //     } catch (error) {
  //       console.error("Error fetchingModels:", error);
  //       toast({
  //         title: "Error fetching models",
  //         description: "Please try again later",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  //   fetchModelVehicles();
  // }, [toast]);

  // const handleModelSelect = (model: ModelVehicle) => {
  //   setSelectedModel(model);
  //   form.setValue("modelVehicleId", model.id);
  //   setIsModelSelectOpen(false);
  // };

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
      const response = await axios.patch(
        `/api/vehicles/vehicles/${vehicle.id}`,
        values
      );
      const updatedVehicle = response.data;
      onEditVehicle(updatedVehicle);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Vehicle updated",
        description: "Vehicle was updated succesfully!",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error updating vehicle",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Carga de Modelos ---------------*/}

            {/*
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

            */}

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

              {/* --------- Cilindraje -------------*/}

              <FormField
                control={form.control}
                name="cylinder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cilindraje</FormLabel>
                    <FormControl>
                      <Input placeholder="Cilindraje Motor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------- Carroceria -------------*/}

              <FormField
                control={form.control}
                name="bodyWork"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrocería</FormLabel>
                    <FormControl>
                      <Input placeholder="Carrocería" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------- Número Motor -------------*/}

              <FormField
                control={form.control}
                name="engineNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Motor</FormLabel>
                    <FormControl>
                      <Input placeholder="Número Motor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------- Número Chasis -------------*/}

              <FormField
                control={form.control}
                name="chasisNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Chasis</FormLabel>
                    <FormControl>
                      <Input placeholder="Número Chasis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --------- Tarjeta Propietario -------------*/}

              <FormField
                control={form.control}
                name="ownerCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarjeta Propietario</FormLabel>
                    <FormControl>
                      <Input placeholder="Tarjeta Propietario" {...field} />
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

              {/* <FormField
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
              /> */}

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen</FormLabel>
                    <FormControl>
                      {fileUploaded ? (
                        <h3 className="text-sm">Archivo subido!</h3>
                      ) : (
                        <Input
                          className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                          type="file"
                          accept=".pdf,image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const uploadedFiles = await startUpload([file]);
                                if (uploadedFiles && uploadedFiles[0]) {
                                  field.onChange(uploadedFiles[0].url);
                                  setFileUploaded(true);
                                }
                              } catch (error) {
                                console.error("Error uploading file:", error);
                              }
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Actualizar</Button>
          </form>
        </Form>
      </DialogContent>
      {/* <ModelSelectModal
        isOpen={isModelSelectOpen}
        setIsOpen={setIsModelSelectOpen}
        models={vehicleModels}
        onSelectModel={handleModelSelect}
      /> */}
    </Dialog>
  );
}
