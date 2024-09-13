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
import { formSchema } from "./FormEditLine.form";
import { useRouter } from "next/navigation";
import { FormEditLineProps } from "./FormEditLine.types";

export function FormEditLine({
  isOpen,
  setIsOpen,
  line,
  onEditLine,
}: FormEditLineProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: line.name,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/vehicles/lines/${line.id}`,
        values
      );
      const updatedLine = response.data;
      onEditLine(updatedLine);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Linea actualizada",
        description: "La linea fue actualizada exitosamente.",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating linea:", error);
      toast({
        title: "Error updating linea",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Linea</DialogTitle>
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
