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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { formSchema } from "./FormEditMantItemProvider.form";
import {
  FormEditMantItemProviderProps,
  MantItem,
  Provider,
} from "../SharedTypes/SharedTypes";
import { ProviderSelectModal } from "../ProviderSelectModal";
import { MantItemSelectModal } from "../MantItemSelectModal";

export function FormEditMantItemProvider({
  isOpen,
  setIsOpen,
  mantItemProvider,
  onEditMantItemProvider,
}: FormEditMantItemProviderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [isProviderSelectOpen, setIsProviderSelectOpen] = useState(false);

  const [mantItems, setMantItems] = useState<MantItem[]>([]);
  const [selectedMantItem, setSelectedMantItem] = useState<MantItem | null>(
    null
  );

  const [isMantItemSelectOpen, setIsMantItemSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mantItemId: mantItemProvider.mantItemId,
      providerId: mantItemProvider.providerId,
      priority: mantItemProvider.priority,
      status: mantItemProvider.status,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* Traemos los items de mantenimiento para forzar el lookup

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/mantenaince/mant-items");
        setMantItems(response.data);
      } catch (error) {
        console.error("Error fetching mant-items:", error);
        toast({
          title: "Error fetching mant-items",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchVehicles();
  }, [toast]);

  //* Traemos los vehiculos para forzar el lookup

  useEffect(() => {
    const fetchMantPlans = async () => {
      try {
        const response = await axios.get("/api/people/provider");
        setProviders(response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast({
          title: "Error fetching providers",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchMantPlans();
  }, [toast]);

  const handleMantItemSelect = (mantItem: MantItem) => {
    setSelectedMantItem(mantItem);
    form.setValue("mantItemId", mantItem.id);
    setIsMantItemSelectOpen(false);
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    form.setValue("providerId", provider.id);
    setIsMantItemSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      console.log("Submitting values:", values); // Para debugging
      const response = await axios.patch(
        `/api/people/mant-item-provider/${mantItemProvider.id}`,
        {
          mantItemId: Number(values.mantItemId),
          providerId: Number(values.providerId),
          priority: 1,
        }
      );

      console.log("Response:", response.data); // Para debugging

      onEditMantItemProvider(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Registro actualizado!",
        description: "El registro fue creado!",
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
          <DialogTitle>Actalizar Relación Proveedor Mant-Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Select Vehiculo --------------- */}

            <FormField
              control={form.control}
              name="mantItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehiculo</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Placa Vehículo"
                          {...field}
                          value={
                            selectedMantItem ? selectedMantItem.id : field.value
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          readOnly
                        />
                        <Input
                          placeholder="Item mant. Seleccionado"
                          value={
                            selectedMantItem ? selectedMantItem.description : ""
                          }
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsMantItemSelectOpen(true)}
                    >
                      Buscar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Select Mant-Plan --------------- */}

            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Plan Mantenimiento"
                          {...field}
                          value={
                            selectedProvider ? selectedProvider.id : field.value
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          readOnly
                        />
                        <Input
                          placeholder="Proveedor Seleccionado"
                          value={selectedProvider ? selectedProvider.name : ""}
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => setIsProviderSelectOpen(true)}
                    >
                      Buscar
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Prioridad ---------------*/}

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="prioridad"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
      <ProviderSelectModal
        isOpen={isProviderSelectOpen}
        setIsOpen={setIsProviderSelectOpen}
        provider={providers}
        onSelectProvider={handleProviderSelect}
      />
      <MantItemSelectModal
        isOpen={isMantItemSelectOpen}
        setIsOpen={setIsMantItemSelectOpen}
        mantItem={mantItems}
        onSelectMantItem={handleMantItemSelect}
      />
    </Dialog>
  );
}
