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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormEditItemWorkOrder.form";
import {
  FormEditWorkOrderItemProps,
  MantItem,
  Provider,
} from "../SharedTypes/SharedTypes";
import { ProviderSelectModal } from "../ProviderSelectModal";
import { MantItemSelectModal } from "../MantItemSelectModal";
import MoneyInput from "@/components/shared/MoneyInput/MoneyInput";

export function FormEditItemWorkOrder({
  isOpen,
  setIsOpen,
  workOrderItem,
  onEditWorkOrderItem,
}: FormEditWorkOrderItemProps) {
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
      woId: workOrderItem.woId,
      mantItemId: workOrderItem.mantItemId,
      providerId: workOrderItem.providerId,
      startDate: workOrderItem.startDate,
      endDate: workOrderItem.endDate,
      cost: workOrderItem.cost,
      actualDuration: workOrderItem.actualDuration,
      executionMileage: workOrderItem.executionMileage,
      notes: workOrderItem.notes,
      state: workOrderItem.state,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* Traemos los items de mantenimiento para forzar el lookup

  useEffect(() => {
    const fetchMantItems = async () => {
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

    fetchMantItems();
  }, [toast]);

  //* Traemos los vehiculos para forzar el lookup

  useEffect(() => {
    const fetchProviders = async () => {
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

    fetchProviders();
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
        `/api/mantenaince/item-work-order/${workOrderItem.id}`,
        {
          mantItemId: Number(values.mantItemId),
          providerId: Number(values.providerId),
          startDate: values.startDate,
          endDate: values.endDate,
          cost: values.cost,
          actualDuration: values.actualDuration,
          executionMileage: values.executionMileage,
          notes: values.notes,
          state: values.state,
        }
      );

      console.log("Response:", response.data); // Para debugging

      onEditWorkOrderItem(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Registro creado!",
        description: "Un nuevo registro fue creado!",
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
          <DialogTitle>Actualizar Item Orden de Trabajo</DialogTitle>
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

            {/* Fecha Inicio */}

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha Fin */}

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "LLL dd, y")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date: Date | undefined) =>
                          field.onChange(date)
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Costo ---------------*/}

            <MoneyInput<z.infer<typeof formSchema>>
              form={form}
              name="cost"
              label="Costo Item $"
            />

            {/* ------------ Duración ---------------*/}

            <FormField
              control={form.control}
              name="actualDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KM Duración</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="KM Duración"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Km de Ejecución ---------------*/}

            <FormField
              control={form.control}
              name="executionMileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KM Ejecución</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="KM Duración"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------ Notas ---------------*/}

            <FormField
              control={form.control}
              name="notes"
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

            {/* --------------- Estado del Item ------------------- */}

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de Propietario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                      <SelectItem value="COMPLETADO">Completado</SelectItem>
                      <SelectItem value="ATRASADO">Atrasado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
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
