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
import { useUploadThing } from "@/app/utils/uploadthing";
import { useRouter } from "next/navigation";
import { formSchema } from "./FormEditTechnician.form";
import { FormEditTechnicianProps } from "./FormEditTechnician.types";

export function FormEditTechnician({
  isOpen,
  setIsOpen,
  item,
  onEditTechnician,
}: FormEditTechnicianProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    item.photo || null
  );
  const { startUpload } = useUploadThing("imageOrDocument");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item.id,
      tenantId: item.tenantId,
      name: item.name,
      specialty: item.specialty,
      contact_info: item.contact_info,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      form.reset({
        id: item.id,
        tenantId: item.tenantId,
        name: item.name,
        specialty: item.specialty,
        contact_info: item.contact_info,
        photo: item.photo,
      });
      setPreviewImage(item.photo || null);
    }
  }, [item, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Crear una URL temporal para la vista previa
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);

        // Subir la imagen usando uploadthing
        const uploadedFiles = await startUpload([file]);

        if (uploadedFiles && uploadedFiles[0]) {
          const imageUrl = uploadedFiles[0].url;
          console.log("Uploaded image URL:", imageUrl); // Para debugging
          form.setValue("photo", imageUrl);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          title: "Error al subir la imagen",
          description: "Por favor, intente nuevamente",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { id, ...updateData } = values;
      console.log("Submitting form with values:", values); // Para debugging

      const response = await axios.patch(
        `/api/people/technician/${item.id}`,
        updateData
      );

      console.log("API response:", response.data); // Para debugging

      onEditTechnician(response.data); // Update the UI with the new line
      setIsOpen(false);
      form.reset();
      toast({
        title: "Técnico actualizado!",
        description: "Un Técnico fue actualizado!",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Algo salió mal",
        variant: "destructive",
      });
    }
  };

  // Cleanup effect for preview image URLs
  useEffect(() => {
    return () => {
      if (previewImage && previewImage !== item.photo) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, item.photo]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Datos del Técnico</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Nombre ---------------*/}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre:</FormLabel>
                  <FormControl>
                    <Input placeholder="Actualizar nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Tipos de Items de Mantenimiento ---------------*/}

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Actualizar Especialidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MECANICA">Mecánica</SelectItem>
                      <SelectItem value="ELECTRICIDAD">Electricidad</SelectItem>
                      <SelectItem value="FRENOS">Frenos</SelectItem>
                      <SelectItem value="NIVELES">Niveles</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Datos de Contacto ---------------*/}

            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="actualizar datos de contacto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="rounded-lg bg-slate-600/20 text-slate-800 outline-dotted outline-3"
                      />
                      {previewImage && (
                        <div className="mt-4 relative h-[200px] w-[200px]">
                          <div
                            className="w-full h-full rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${previewImage})` }}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
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
