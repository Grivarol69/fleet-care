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
import { formSchema } from "./FormAddWorkOrder.form";
import {
  FormAddWorkOrderProps,
  Vehicle,
  Provider,
  Technician,
} from "../SharedTypes/SharedTypes";

import { VehicleSelectModal } from "../VehicleSelectModal/VehicleSelectModal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ProviderSelectModal } from "../ProviderSelectModal";
import { TechnicianSelectModal } from "../TechnicianSelectModal";
import MoneyInput from "@/components/shared/MoneyInput/MoneyInput";

export function FormAddWorkOrder({
  isOpen,
  setIsOpen,
  onAddWorkOrder,
}: FormAddWorkOrderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [isTechnicianSelectOpen, setIsTechnicianSelectOpen] = useState(false);

  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [isProviderSelectOpen, setIsProviderSelectOpen] = useState(false);

  const [displayValue, setDisplayValue] = useState("");
  const [displayRealValue, setDisplayRealValue] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      vehiclePlate: "",
      maintenanceType: "PREVENTIVO",
      priority: "ALTA",
      creationDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      plannedAmount: 0,
      realAmount: 0,
      otstatus: "PENDIENTE",
      creationMileage: 0,
      technicianId: 0,
      providerId: 0,
      remarks: "",
      status: "ACTIVE",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  //* Traemos los vehiculos para forzar el lookup

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Error fetching vehicles",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchVehicles();
  }, [toast]);

  //* Traemos los proveedores para forzar el lookup

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

  //* Traemos los técnicos para forzar el lookup

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get("/api/people/technician");
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching Technician:", error);
        toast({
          title: "Error fetching Technician",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchTechnicians();
  }, [toast]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    form.setValue("vehiclePlate", vehicle.licensePlate);
    setIsVehicleSelectOpen(false);
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    form.setValue("providerId", provider.id);
    setIsProviderSelectOpen(false);
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    form.setValue("technicianId", technician.id);
    setIsTechnicianSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      console.log("Submitting values:", values); // Para debugging
      const response = await axios.post(`/api/mantenaince/work-order`, {
        tenantId: values.tenantId,
        vehiclePlate: values.vehiclePlate,
        maintenanceType: values.maintenanceType,
        priority: values.priority,
        creationDate: values.creationDate || new Date(),
        startDate: values.startDate || new Date(),
        endDate: values.endDate || new Date(),
        plannedAmount: Number(values.plannedAmount),
        realAmount: Number(values.realAmount),
        otstatus: values.otstatus,
        creationMileage: Number(values.creationMileage),
        technicianId: Number(values.technicianId),
        providerId: Number(values.providerId),
        remarks: values.remarks,
      });

      console.log("Response:", response.data); // Para debugging

      onAddWorkOrder(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Work Order creada!",
        description: "Un nuevo Work Order fue creado!",
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Orden de Trabajo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* ------------ Select Vehiculo --------------- */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="vehiclePlate"
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
                              selectedVehicle
                                ? selectedVehicle.licensePlate
                                : field.value
                            }
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            readOnly
                          />
                          <Input
                            placeholder="Vehículo Seleccionado"
                            value={
                              selectedVehicle ? selectedVehicle.brandName : ""
                            }
                            readOnly
                          />
                        </div>
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => setIsVehicleSelectOpen(true)}
                      >
                        Buscar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Estado del Plan-Vehiculo ---------------*/}

              <FormField
                control={form.control}
                name="maintenanceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Tipo de Orden" />
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

              {/* ------------ Priority ---------------*/}

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Prioridad"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Creación */}

              <FormField
                control={form.control}
                name="creationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Creación OT</FormLabel>
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
                            date < new Date("1900-01-01") ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 2
                                )
                              )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Inicio Orden de Trabajo */}

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Inicio OT</FormLabel>
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
                            date < new Date("1900-01-01") ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 2
                                )
                              )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Inicio Orden de Trabajo */}

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Finalización OT</FormLabel>
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
                            date < new Date("1900-01-01") ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 2
                                )
                              )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Monto Planeado ---------------*/}

              <MoneyInput<z.infer<typeof formSchema>>
                form={form}
                name="plannedAmount"
                label="Monto Planeado $"
              />

              <FormField
                control={form.control}
                name="plannedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Planeado $</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0,00"
                        value={displayValue}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^\d,.]*/g, "")
                            .replace(/,/g, ".")
                            .replace(/(\..*?)\..*/g, "$1");

                          setDisplayValue(value);

                          // Convertir a number en lugar de Decimal
                          try {
                            if (value) {
                              const numberValue = parseFloat(value);
                              if (
                                !isNaN(numberValue) &&
                                numberValue >= 0 &&
                                numberValue <= 99999999.99
                              ) {
                                field.onChange(numberValue);
                              }
                            } else {
                              field.onChange(0);
                            }
                          } catch (error) {
                            console.log("Error al convertir a número:", error);
                          }
                        }}
                        onBlur={(e) => {
                          try {
                            if (e.target.value) {
                              const value = parseFloat(e.target.value);
                              const formattedValue = value
                                .toFixed(2)
                                .replace(".", ",");
                              setDisplayValue(formattedValue);
                            }
                          } catch (error) {
                            setDisplayValue("");
                          }
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Monto Planeado ---------------*/}

              <FormField
                control={form.control}
                name="realAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Real $</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0,00"
                        value={displayRealValue}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^\d,.]*/g, "")
                            .replace(/,/g, ".")
                            .replace(/(\..*?)\..*/g, "$1");

                          setDisplayRealValue(value);

                          // Convertir a number en lugar de Decimal
                          try {
                            if (value) {
                              const numberValue = parseFloat(value);
                              if (
                                !isNaN(numberValue) &&
                                numberValue >= 0 &&
                                numberValue <= 99999999.99
                              ) {
                                field.onChange(numberValue);
                              }
                            } else {
                              field.onChange(0);
                            }
                          } catch (error) {
                            console.log("Error al convertir a número:", error);
                          }
                        }}
                        onBlur={(e) => {
                          try {
                            if (e.target.value) {
                              const value = parseFloat(e.target.value);
                              const formattedValue = value
                                .toFixed(2)
                                .replace(".", ",");
                              setDisplayRealValue(formattedValue);
                            }
                          } catch (error) {
                            setDisplayRealValue("");
                          }
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Estado del Plan-Vehiculo ---------------*/}

              <FormField
                control={form.control}
                name="otstatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                        <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                        <SelectItem value="COMPLETADO">Correctivo</SelectItem>
                        <SelectItem value="ATRASADO">Atrasado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ KM Completados ---------------*/}

              <FormField
                control={form.control}
                name="creationMileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KM Creación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="KM Creación"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Select Proveedor --------------- */}

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Técnico</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Técnico"
                            {...field}
                            value={
                              selectedTechnician
                                ? selectedTechnician.id
                                : field.value
                            }
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            readOnly
                          />
                          <Input
                            placeholder="Técnico Seleccionado"
                            value={
                              selectedTechnician ? selectedTechnician.name : ""
                            }
                            readOnly
                          />
                        </div>
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => setIsTechnicianSelectOpen(true)}
                      >
                        Buscar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ------------ Select Proveedor --------------- */}

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
                            placeholder="Proveedor"
                            {...field}
                            value={
                              selectedProvider
                                ? selectedProvider.id
                                : field.value
                            }
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            readOnly
                          />
                          <Input
                            placeholder="Proveedor Seleccionado"
                            value={
                              selectedProvider ? selectedProvider.name : ""
                            }
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
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <VehicleSelectModal
        isOpen={isVehicleSelectOpen}
        setIsOpen={setIsVehicleSelectOpen}
        vehicles={vehicles}
        onSelectVehicle={handleVehicleSelect}
      />
      <ProviderSelectModal
        isOpen={isProviderSelectOpen}
        setIsOpen={setIsProviderSelectOpen}
        provider={providers}
        onSelectProvider={handleProviderSelect}
      />
      <TechnicianSelectModal
        isOpen={isTechnicianSelectOpen}
        setIsOpen={setIsTechnicianSelectOpen}
        technician={technicians}
        onSelectTechnician={handleTechnicianSelect}
      />
    </Dialog>
  );
}
