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
import { formSchema } from "./FormAddMantItems.form";
import { FormAddMantItemsProps } from "./FormAddMantItems.types";

type Categories = {
  id: number;
  description: string;
};

export function FormAddMantItems({
  isOpen,
  setIsOpen,
  onAddMantItem,
}: FormAddMantItemsProps) {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      description: "",
      mant_type: "",
      estimated_time: 0,
      idCategory: 0,
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
      setIsSubmitting(true);

      console.log("Submitting values:", values); // Para debugging
      const response = await axios.post(`/api/mantenaince/mant-items`, {
        tenantId: values.tenantId,
        description: values.description,
        mant_type: values.mant_type,
        estimated_time: Number(Number(values.estimated_time).toFixed(2)),
        idCategory: Number(values.idCategory),
      });

      console.log("Response:", response.data); // Para debugging

      onAddMantItem(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Item de Mantenimiento creado!",
        description: "Un nuevo Item de Mantenimiento fue creado!",
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
          <DialogTitle>Agregar Nuevo Item de Mantenimiento</DialogTitle>
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
                  <FormLabel>Tiempo estimado (horas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="999.99"
                      step="0.5"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 999.99) {
                          field.onChange(value);
                        }
                      }}
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
