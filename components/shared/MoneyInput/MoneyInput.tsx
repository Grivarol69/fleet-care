import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface MoneyInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  maxValue?: number;
  className?: string;
}

function MoneyInput<T extends FieldValues>({
  form,
  name,
  label = "Monto",
  maxValue = 99999999.99,
  className,
}: MoneyInputProps<T>) {
  const [displayValue, setDisplayValue] = useState("");

  const formatMoney = (value: number): string => {
    if (!value && value !== 0) return "";
    return value
      .toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })
      .replace(".", ",");
  };

  const parseMoneyToNumber = (value: string): number => {
    const cleanValue = value
      .replace(/[^\d,.]*/g, "")
      .replace(/,/g, ".")
      .replace(/(\..*?)\..*/g, "$1");
    return cleanValue ? parseFloat(cleanValue) : 0;
  };

  useEffect(() => {
    const formValue = form.watch(name);
    setDisplayValue(formatMoney(formValue));
  }, [form, name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    const numberValue = parseMoneyToNumber(inputValue);

    if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= maxValue) {
      form.setValue(name, numberValue as any); // Usamos type assertion aquí
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const value = parseMoneyToNumber(e.target.value);
      setDisplayValue(formatMoney(value));
    } catch {
      setDisplayValue("");
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="0,00"
              value={displayValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="text-right"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default MoneyInput;
