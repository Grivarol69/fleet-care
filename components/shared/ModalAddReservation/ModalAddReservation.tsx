import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ModalAddReservationProps } from "./ModalAddReservation.types";
import { Button } from "@/components/ui/button";
import { Car } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { addDays } from "date-fns";
import CalendarSelector from "./CalendarSelector/CalendarSelector";
import { DateRange } from "react-day-picker";

export function ModalAddReservation(props: ModalAddReservationProps) {
  const { car } = props;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateSelected, setDateSelected] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: new Date(), to: addDays(new Date(), 5) });

  const onReserveCar = async (car: Car, dateSelected: DateRange) => {
    console.log("reserve car");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" className="w-full mt-3">
          Reservar Vehículo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Selecciona las fechas en que quieres alquilar el vehículo.
          </AlertDialogTitle>
          <AlertDialogDescription>
            <CalendarSelector
              setDateSelected={setDateSelected}
              carPriceDay={car.priceDay}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => onReserveCar(car, dateSelected)}>
            Reservar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
