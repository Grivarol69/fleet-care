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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormEditPlanVehicle.form";
import {
  FormAddPlanVehicleProps,
  PlanVehicle,
  Vehicle,
  MantPlan,
  FormEditPlanVehicleProps,
} from "../SharedTypes/SharedTypes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { VehicleSelectModal } from "../VehicleSelectModal/VehicleSelectModal";
import { MantPlanSelectModal } from "../MantPlanSelectModal";
import { ItemPlanVehiclesList } from "./components/ItemPlanVehiclesList";

export function FormEditPlanVehicle({
  isOpen,
  setIsOpen,
  item,
  onEditPlanVehicle,
}: FormEditPlanVehicleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleSelectOpen, setIsVehicleSelectOpen] = useState(false);

  const [mantPlans, setMantPlans] = useState<MantPlan[]>([]);
  const [selectedMantPlan, setSelectedMantPlan] = useState<MantPlan | null>(
    null
  );
  const [isMantPlanSelectOpen, setIsMantPlanSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      vehiclePlate: item.vehiclePlate,
      mantPlanId: item.mantPlanId,
      assignedAt: item.assignedAt,
      completedKm: item.completedKm,
      status: item.status,
      lastKmCheck: item.lastKmCheck,
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

  //* Traemos los vehiculos para forzar el lookup

  useEffect(() => {
    const fetchMantPlans = async () => {
      try {
        const response = await axios.get("/api/mantenaince/mant-plan");
        setMantPlans(response.data);
      } catch (error) {
        console.error("Error fetching mant-plan:", error);
        toast({
          title: "Error fetching mant-plan",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchMantPlans();
  }, [toast]);

  const handleVehicleSelect = (vehicles: Vehicle) => {
    setSelectedVehicle(vehicles);
    form.setValue("vehiclePlate", vehicles.licensePlate);
    setIsVehicleSelectOpen(false);
  };

  const handleMantPlansSelect = (plan: MantPlan) => {
    setSelectedMantPlan(plan);
    form.setValue("mantPlanId", plan.id);
    setIsMantPlanSelectOpen(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      console.log("Submitting values:", values); // Para debugging
      const response = await axios.patch(
        `/api/mantenaince/plan-vehicle/${item.id}`,
        {
          tenantId: values.tenantId,
          vehiclePlate: values.vehiclePlate,
          mantPlanId: Number(values.mantPlanId),
          assignedAt: values.assignedAt || new Date(),
          completedKm: Number(values.completedKm),
          status: values.status,
          lastKmCheck: Number(values.lastKmCheck),
        }
      );

      console.log("Response:", response.data); // Para debugging

      onEditPlanVehicle(response.data);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Plan-Vehiculo actualizado!",
        description: "Un Plan-Vehiculo fue actualizado!",
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
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Actualizar Relación Plan-Vehiculo</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="tasks">Items Vehículo-Plan</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* ------------ Select Vehiculo --------------- */}

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
                                placeholder="Item Mantenimiento"
                                value={
                                  selectedVehicle
                                    ? selectedVehicle.brandName
                                    : ""
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

                  {/* ------------ Select Mant-Plan --------------- */}

                  <FormField
                    control={form.control}
                    name="mantPlanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Mantenimiento</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Plan Mantenimiento"
                                {...field}
                                value={
                                  selectedMantPlan
                                    ? selectedMantPlan.id
                                    : field.value
                                }
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                readOnly
                              />
                              <Input
                                placeholder="Plan Mantenimiento"
                                value={
                                  selectedMantPlan
                                    ? selectedMantPlan.description
                                    : ""
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

                  {/* Fecha Asignación del Plan al Vehículo */}

                  <FormField
                    control={form.control}
                    name="assignedAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha Subida Archivo</FormLabel>
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ------------ KM Completados ---------------*/}

                  <FormField
                    control={form.control}
                    name="completedKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Completados</FormLabel>
                        <FormControl>
                          <Input placeholder="KM Completados" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ------------ KM Completados ---------------*/}

                  <FormField
                    control={form.control}
                    name="lastKmCheck"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Última Lectura</FormLabel>
                        <FormControl>
                          <Input placeholder="KM Última Lectura" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ------------ Estado del Plan-Vehiculo ---------------*/}

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
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
                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                            <SelectItem value="EN_PROCESO">
                              En Proceso
                            </SelectItem>
                            <SelectItem value="CORRECTIVO">
                              Correctivo
                            </SelectItem>
                            <SelectItem value="COMPLETADO">
                              Completado
                            </SelectItem>
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
            </TabsContent>
            <TabsContent value="tasks" className="mt-4">
              <div className="min-h-[600px]">
                <ItemPlanVehiclesList planId={item.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
      <VehicleSelectModal
        isOpen={isVehicleSelectOpen}
        setIsOpen={setIsVehicleSelectOpen}
        vehicles={vehicles}
        onSelectVehicle={handleVehicleSelect}
      />
      <MantPlanSelectModal
        isOpen={isMantPlanSelectOpen}
        setIsOpen={setIsMantPlanSelectOpen}
        mantplans={mantPlans}
        onSelectMantPlan={handleMantPlansSelect}
      />
    </Dialog>
  );
}
