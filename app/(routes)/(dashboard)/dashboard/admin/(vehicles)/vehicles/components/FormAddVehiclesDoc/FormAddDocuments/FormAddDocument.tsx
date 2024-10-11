import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./FormAddDocuments.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "@/app/utils/uploadthing";
import { Document, FormAddDocumentProps } from "./FormAddDocumentsProps";

export function FormAddDocument({ onDocumentAdded }: FormAddDocumentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "SOAT",
      fileName: "",
      fileUrl: "",
      uploadDate: "",
      expiryDate: "",
      insurance: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newDocument: Document = {
      id: crypto.randomUUID(),
      type: values.type,
      fileName: values.fileName,
      fileUrl: values.fileUrl,
      uploadDate: new Date(),
      expiryDate: values.expiryDate ? new Date(values.expiryDate) : null,
      status: "VIGENTE",
      insurance: values.insurance || "",
    };

    onDocumentAdded(newDocument);
    setIsOpen(false);
    form.reset();
    setFileUploaded(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Agregar Documento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Documento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archivo</FormLabel>
                  <FormControl>
                    {fileUploaded ? (
                      <p className="text-sm">Archivo cargado exitosamente!</p>
                    ) : (
                      <UploadButton
                        className="w-full"
                        endpoint="documentUploader"
                        onClientUploadComplete={(res) => {
                          form.setValue("file", res?.[0].url);
                          setFileUploaded(true);
                        }}
                        onUploadError={(error: Error) => {
                          console.error(error);
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Agregar Documento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
