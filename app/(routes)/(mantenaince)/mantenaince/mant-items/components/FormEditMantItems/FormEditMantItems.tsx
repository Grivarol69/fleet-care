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

import { useRouter } from "next/navigation";
import { formSchema } from "./FormEditMantItems.form";
import { FormEditMantItemsProps } from "./FormEditMantItems.types";

type Categories = {
  id: number;
  description: string;
};

export function FormEditMantItems({
  isOpen,
  setIsOpen,
  item,
  onEditMantItems,
}: FormEditMantItemsProps) {
  const [categories, setCategories] = useState<Categories[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: item.id,
      description: item.description,
      mant_type: item.mant_type,
      estimated_time: item.estimated_time,
      idCategory: item.idCategory,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* fetch Categories from Database

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get(`/api/mantenaince/mant_categories`);
        setCategories(response.data);
      } catch (error) {
        console.log("Error al cargar las categorias", error);
      }
    };

    fetchingCategories();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/mantenaince//api/mantenaince/mant-items/${item.id}`,
        values
      );

      onEditMantItems(response.data); // Update the UI with the new line
      setIsOpen(false);
      form.reset();
      toast({
        title: "Item de Mantenimiento actualizado!",
        description: "Item de Mantenimiento fue actualizado!",
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
          <DialogTitle>Editar Item de Mantenimiento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Descripción ---------------*/}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción:</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Tipos de Items de Mantenimiento ---------------*/}

            <FormField
              control={form.control}
              name="mant_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipos de Item</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione Tipo de Item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PREVENTIVO">Preventivo</SelectItem>
                      <SelectItem value="PREDICTIVO">Predictivo</SelectItem>
                      <SelectItem value="CORRECTIVO">Correctivo</SelectItem>
                      <SelectItem value="ON_DEMAND">On Demand</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Tiempo Estimado ---------------*/}

            <FormField
              control={form.control}
              name="estimated_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiempo estimado - Horas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Horas estimadas"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Carga de Categorias ---------------*/}

            <FormField
              control={form.control}
              name="idCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.description}
                        </SelectItem>
                      ))}
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
    </Dialog>
  );
}
