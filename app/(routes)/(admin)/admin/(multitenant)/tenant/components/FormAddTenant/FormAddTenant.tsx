import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUploadThing } from "@/app/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

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

import { formSchema } from "./FormAddTenant.form";
import { FormAddTenantProps } from "./FormAddTenant.types";

export function FormAddTenant({
  isOpen,
  setIsOpen,
  onAddTenant,
}: FormAddTenantProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("imageOrDocument");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      photo: "",
      domain: "",
      rut_nit: "",
    },
  });

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

      const response = await axios.post(`/api/admin/tenant`, {
        name: values.name,
        domain: values.domain,
        photo: values.photo,
        rut_nit: values.rut_nit,
      });

      console.log("API response:", response.data);

      onAddTenant(response.data);
      setIsOpen(false);
      form.reset();
      setPreviewImage(null);

      toast({
        title: "Nuevo Tenant creado!",
        description: "Un nuevo tenant fue creado exitosamente!",
      });

      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Algo salió mal",
        description: "Error al crear el tenant",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Debugging: monitorear cambios en el campo photo
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "photo") {
        console.log("Photo field changed:", value.photo);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Tenant</DialogTitle>
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
                    <Input placeholder="Ingresar nombre completo" {...field} />
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
                    <Input placeholder="Dominio" {...field} />
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
                  <FormLabel>RUT-NIT:</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresar RUT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                            style={{ backgroundImage: `url(${previewImage})` }}
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
            <Button
              type="submit"
              disabled={isUploading || !form.formState.isDirty}
            >
              {isUploading ? "Subiendo..." : "Enviar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
