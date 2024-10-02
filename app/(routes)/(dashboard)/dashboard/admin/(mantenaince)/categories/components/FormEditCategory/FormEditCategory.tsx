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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

type FormEditCategoryProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  category: { id: number; description: string };
  onEditCategory: (category: { id: number; description: string }) => void;
};

export function FormEditCategory({
  isOpen,
  setIsOpen,
  category,
  onEditCategory,
}: FormEditCategoryProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: category.description,
    },
  });

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/category/${category.id}`,
        values
      );
      const updatedCategory = response.data;
      onEditCategory(updatedCategory);
      setIsOpen(false);
      form.reset();
      toast({
        title: "Category updated!",
        description: "The category has been successfully updated.",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error updating category",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
