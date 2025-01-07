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
import { useUploadThing } from "@/app/utils/uploadthing";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { formSchema } from "./FormEditTenant.form";
import { FormEditTenantProps } from "./FormEditTenant.types";

export function FormEditTenant({
  isOpen,
  setIsOpen,
  item,
  onEditTenant,
}: FormEditTenantProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    item.photo || null
  );
  const { startUpload } = useUploadThing("imageOrDocument");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      photo: item.photo,
      domain: item.domain,
      rut_nit: item.rut_nit,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        id: item.id,
        name: item.name,
        photo: item.photo,
        domain: item.domain,
        rut_nit: item.rut_nit,
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
      // Excluimos el id de los valores a enviar
      const { id, ...updateData } = values;
      console.log("Submitting form with values:", values); // Para debugging

      const response = await axios.patch(
        `/api/admin/tenant/${item.id}`,
        updateData
      );

      console.log("API response:", response.data); // Para debugging

      onEditTenant(response.data);
      setIsOpen(false);
      form.reset();
      setPreviewImage(null);

      toast({
        title: "Tenant actualizado!",
        description: "Un tenant fue actualizado!",
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
          <DialogTitle>Actualizar Datos del Tenant</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dominio:</FormLabel>
                  <FormControl>
                    <Input placeholder="actualizar dominio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rut_nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT:</FormLabel>
                  <FormControl>
                    <Input placeholder="Actualizar rut" {...field} />
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
