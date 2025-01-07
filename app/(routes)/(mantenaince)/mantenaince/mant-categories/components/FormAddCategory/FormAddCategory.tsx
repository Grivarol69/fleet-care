"use client";

import { useState } from "react";
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
import axios from "axios";
// import { toast } from "@/components/ui/use-toast";
// import { useToast } from "@/components/ui/use-toast";
import { useToast } from "@/components/hooks/use-toast";

import { useRouter } from "next/navigation";
import { formSchema } from "./FormAddCategory.form";

type FormAddCategoryProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddCategory: (category: { id: number; description: string }) => void;
};

export function FormAddCategory({
  isOpen,
  setIsOpen,
  onAddCategory,
}: FormAddCategoryProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Here you would typically make an API call to add the category
    // For now, we'll just simulate it with a setTimeout

    try {
      const response = await axios.post(
        `/api/mantenaince/mant_categories`,
        values
      );

      const newCategory = response.data;

      onAddCategory(newCategory); // Update the UI with the new category
      setIsOpen(false);
      form.reset();
      toast({
        title: "Category created!",
        description: "New Category was created!",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
