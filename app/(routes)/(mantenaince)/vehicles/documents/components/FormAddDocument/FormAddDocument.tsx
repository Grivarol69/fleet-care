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
import { formSchema } from "./FormAddDocument.form";
import { FormAddDocumentProps, VehicleProps } from "./FormAddDocument.types";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { VehicleSelectModal } from "../VehicleSelectModal";
import { useUploadThing } from "@/app/utils/uploadthing";

export function FormAddDocument({
  isOpen,
  setIsOpen,
  onAddDocument,
}: FormAddDocumentProps) {
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProps | null>(
    null
  );
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const { startUpload } = useUploadThing("imageOrDocument");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiclePlate: "",
      type: "",
      fileName: "",
      fileUrl: "",
      uploadDate: new Date(),
      expiryDate: new Date(),
      insurance: "",
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
      const documentData = {
        vehiclePlate: values.vehiclePlate,
        tenantId: "",
        type: values.type,
        fileName: values.fileName,
        fileUrl: values.fileUrl,
        uploadDate: values.uploadDate || new Date(),
        expiryDate: values.expiryDate || new Date(),
        status: "VIGENTE",
        insurance: values.insurance || "",
      };

      const response = await axios.post(
        `/api/vehicles/documents`,
        documentData
      );

      const newDocument = response.data;

      onAddDocument(newDocument); // Update the UI with the new document
      setIsOpen(false);
      form.reset();
      toast({
        title: "Documento creado!",
        description: "Un nuevo Documento fue creado!",
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
          <DialogTitle>Agregar Nuevo Documento</DialogTitle>
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

            {/* ------------ Tipo de Documento ---------------*/}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione Tipo de Documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SOAT">SOAT</SelectItem>
                      <SelectItem value="TECNOMECANICA">
                        Tecnomecánica
                      </SelectItem>
                      <SelectItem value="POLIZA">Poliza</SelectItem>
                      <SelectItem value="OTRO">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Número Documento ---------------*/}

            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número Documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ PDF ---------------

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen Documento</FormLabel>
                  <FormControl>
                    {photoUploaded ? (
                      <h3 className="text-sm">Document uploaded!</h3>
                    ) : (
                      <UploadButton
                        className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                        {...field}
                        endpoint="photo"
                        onClientUploadComplete={(res) => {
                          form.setValue("fileUrl", res?.[0].url);
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

            */}

            {/* <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento o Imagen</FormLabel>
                  <FormControl>
                    {fileUploaded ? (
                      <h3 className="text-sm">Archivo subido!</h3>
                    ) : (
                      <UploadButton
                        className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                        {...field}
                        endpoint="imageOrDocument"
                        content={{
                          button({ ready }) {
                            if (ready) return "Subir archivo";
                            return "Preparando...";
                          },
                          allowedContent({ ready }) {
                            if (ready) return "PDF o Imágenes hasta 4MB";
                            return "Cargando...";
                          },
                        }}
                        config={{
                          mode: "auto",
                          appendOnPaste: true,
                        }}
                        appearance={{
                          button: { width: "100%" },
                          allowedContent: { display: "none" },
                        }}
                        onClientUploadComplete={(res) => {
                          form.setValue("fileUrl", res?.[0].url);
                          setFileUploaded(true);
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
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento o Imagen</FormLabel>
                  <FormControl>
                    {fileUploaded ? (
                      <h3 className="text-sm">Archivo subido!</h3>
                    ) : (
                      <Input
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

            {/* Fecha de subida de archivo */}

            <FormField
              control={form.control}
              name="uploadDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Subida Archivo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de Vencimiento del documento */}

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Vencimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        // onSelect={(date: Date | undefined) =>
                        //   field.onChange(date)
                        // }
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Aseguradora ---------------*/}

            <FormField
              control={form.control}
              name="insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aseguradora</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione Aseguradora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UNO">Compañia Seguros UNO</SelectItem>
                      <SelectItem value="DOS">Compañia Seguros DOS</SelectItem>
                      <SelectItem value="TRES">
                        Compañia Seguros TRES
                      </SelectItem>
                      <SelectItem value="CUATRO">
                        Compañia Seguros CUATRO
                      </SelectItem>
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
      <VehicleSelectModal
        isOpen={isVehicleSelectOpen}
        setIsOpen={setIsVehicleSelectOpen}
        vehicles={vehicles}
        onSelectVehicle={handleVehicleSelect}
      />
    </Dialog>
  );
}
