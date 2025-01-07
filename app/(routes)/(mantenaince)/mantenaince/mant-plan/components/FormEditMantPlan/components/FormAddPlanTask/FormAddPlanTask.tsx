import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

import { formSchema } from "./FormAddPlanTask.form";
import { MantItemsSelectModal } from "../MantItemsSelectModal";
import {
  FormAddPlanTaskProps,
  MantItemsSelectModalProps,
  MantItem,
} from "../SharedTypes/SharedTypes";

export function FormAddPlanTask({
  isOpen,
  setIsOpen,
  planId,
  onAddPlanTask,
}: FormAddPlanTaskProps) {
  const [mantItems, setMantItems] = useState<MantItem[]>([]);
  const [selectedMantItems, setSelectedMantItems] = useState<MantItem | null>(
    null
  );
  const [isMantItemsSelectOpen, setIsMantItemsSelectOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      planId,
      mantItemId: 0,
      triggerKm: 0,
    },
  });

  //* Traemos los items de mantenimiento para forzar el lookup

  useEffect(() => {
    const fetchMantItems = async () => {
      try {
        const response = await axios.get("/api/mantenaince/mant-items");
        setMantItems(response.data);
      } catch (error) {
        console.error("Error fetching Mant items:", error);
        toast({
          title: "Error fetching mant items",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchMantItems();
  }, [toast]);

  const handleMantItemsSelect = (item: MantItem) => {
    setSelectedMantItems(item);
    form.setValue("mantItemId", item.id);
    setIsMantItemsSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Valores a enviar:", values); // Verificar que mantItemId tiene el ID correcto
    try {
      const response = await axios.post(`/api/mantenaince/plan-task`, values);

      onAddPlanTask(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Nueva Tarea creada!",
        description: "Una nueva Tarea fue creada!",
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
          <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Item Mantenimiento --------------- */}

            <FormField
              control={form.control}
              name="mantItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Mantenimiento</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Item Mantenimiento"
                          {...field}
                          value={
                            selectedMantItems
                              ? selectedMantItems.id
                              : field.value
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          readOnly
                        />
                        <Input
                          placeholder="Item Mantenimiento"
                          value={
                            selectedMantItems
                              ? selectedMantItems.description
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsMantItemsSelectOpen(true)}
                    >
                      Buscar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Km Acción:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="KM Acción"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      </DialogContent>
      <MantItemsSelectModal
        isOpen={isMantItemsSelectOpen}
        setIsOpen={setIsMantItemsSelectOpen}
        mantItem={mantItems}
        onSelectMantItems={handleMantItemsSelect}
      />
    </Dialog>
  );
}
