"use client";

import { useState } from "react";
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
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormAddBrand.form";
import { FormAddBrandProps } from "./FormAddBrand.types";

export function FormAddBrand({
  isOpen,
  setIsOpen,
  onAddBrand,
}: FormAddBrandProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Here you would typically make an API call to add the category
    // For now, we'll just simulate it with a setTimeout

    try {
      const response = await axios.post(`/api/vehicles/brands`, values);

      const newBrand = response.data;

      onAddBrand(newBrand); // Update the UI with the new brand
      setIsOpen(false);
      form.reset();
      toast({
        title: "Marca creada!",
        description: "Una nueva Marca fue creada!",
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
          <DialogTitle>Agregar Nueva Marca</DialogTitle>
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
            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
