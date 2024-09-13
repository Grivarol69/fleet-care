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
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { formSchema } from "./FormEditBrand.form";
import { useRouter } from "next/navigation";
import { FormEditBrandProps } from "./FormEditBrand.types";

export function FormEditBrand({
  isOpen,
  setIsOpen,
  brand,
  onEditBrand,
}: FormEditBrandProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: brand.name,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/vehicles/brands/${brand.id}`,
        values
      );
      const updatedBrand = response.data;
      onEditBrand(updatedBrand);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Marca actualizada",
        description: "La marca fue actualizada exitosamente.",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating brand:", error);
      toast({
        title: "Error updating brand",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Marca</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Actualizar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
