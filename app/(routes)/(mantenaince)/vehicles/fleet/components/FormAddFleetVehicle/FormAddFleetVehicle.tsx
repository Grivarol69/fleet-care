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
// import { UploadButton } from "@/app/utils/uploadthing";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormAddFleetVehicle.form";
import { FormAddFleetVehicleProps } from "../SharedTypes/sharedTypes";
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

export function FormAddFleetVehicle({
  isOpen,
  setIsOpen,
  onAddFleetVehicle,
}: FormAddFleetVehicleProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("imageOrDocument");

  // const [photoUploaded, setPhotoUploaded] = useState(false);
  // const [fileUploaded, setFileUploaded] = useState<boolean>(false);

  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
  const [vehicleLines, setVehicleLines] = useState<VehicleLine[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: "",
      licensePlate: "",
      typePlate: "",
      brandId: 0,
      lineId: 0,
      typeId: 0,
      mileage: 0,
      cylinder: 0,
      bodyWork: "",
      engineNumber: "",
      chasisNumber: "",
      ownerCard: "",
      color: "",
      owner: "",
      year: 0,
      situation: "",
      tenantId: "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);

        // Crear una URL temporal para la vista previa
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);

        // Subir la imagen usando uploadthing
        const uploadedFiles = await startUpload([file]);

        if (!uploadedFiles || !uploadedFiles[0]?.url) {
          throw new Error("Failed to upload image");
        }

        const imageUrl = uploadedFiles[0].url;
        console.log("Uploaded image URL:", imageUrl);

        // Actualizar el campo photo en el formulario
        form.setValue("photo", imageUrl, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        // Verificar que el valor se haya establecido correctamente
        console.log("Form values after setting photo:", form.getValues());
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error al subir la imagen",
          description: "Por favor, intente nuevamente",
          variant: "destructive",
        });
        // Limpiar la vista previa y el campo en caso de error
        setPreviewImage(null);
        form.setValue("photo", "", { shouldValidate: true });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Verificar que tenemos una URL de imagen antes de enviar
      if (!values.photo) {
        toast({
          title: "Error",
          description:
            "Por favor, sube una imagen antes de enviar el formulario",
          variant: "destructive",
        });
        return;
      }

      // Log para debugging
      console.log("Submitting form with values:", {
        ...values,
        photoLength: values.photo.length,
      });

      const formattedValues = {
        ...values,
        photo: String(values.photo),
        licensePlate: String(values.licensePlate).toUpperCase(),
        typePlate: String(values.typePlate),
        brandId: Number(values.brandId),
        lineId: Number(values.lineId),
        typeId: Number(values.typeId),
        mileage: Number(values.mileage),
        cylinder: Number(values.cylinder),
        bodyWork: String(values.bodyWork),
        engineNumber: String(values.engineNumber),
        chasisNumber: String(values.chasisNumber),
        ownerCard: String(values.ownerCard),
        color: String(values.color).toUpperCase(),
        owner: String(values.owner),
        year: Number(values.year),
        situation: String(values.situation),
      };

      const response = await axios.post(
        `/api/vehicles/vehicles`,
        formattedValues
      );

      onAddFleetVehicle(response.data); // Update the UI with the new vehicle
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

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Debugging: monitorear cambios en el campo photo
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "photo") {
        console.log("Photo field changed:", value.photo);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Vehiculo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* --------- Placa Vehículo -------------*/}

                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa Vehículo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Placa Vehículo"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
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
                          <SelectItem value="PARTICULAR">Particular</SelectItem>
                          <SelectItem value="PUBLICO">Público</SelectItem>
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
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                        <Input
                          placeholder="Cilindraje Motor"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
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
              /> */}

              {/* --------- Imagen del vehiculo -------------*/}
              <div className="lg:col-span-1 space-y-4">
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                          />
                          {isUploading && (
                            <div className="text-sm text-slate-500">
                              Subiendo imagen...
                            </div>
                          )}
                          {previewImage && (
                            <div className="mt-4 relative h-[200px] w-[200px]">
                              <div
                                className="w-full h-full rounded-lg bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${previewImage})`,
                                }}
                              />
                            </div>
                          )}
                          <input type="hidden" value={value} {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit">Crear Modelo</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
