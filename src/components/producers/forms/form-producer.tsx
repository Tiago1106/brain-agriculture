"use client"

import { useEffect, useState } from "react"
import { Pencil } from "lucide-react"

import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { useProducerStore } from "@/stores/useProducerStore"
import { useFarmStore } from "@/stores/useFarmStore"

import { MaskDocument } from "@/lib/masks"
import { createProducerSchema } from "@/lib/validations"
import { Producer } from "@/types/producer"

type FormValues = z.infer<ReturnType<typeof createProducerSchema>>

interface ProducerFormProps {
  isEdit?: Producer | undefined
}

const defaultValues: FormValues = {
  name: "",
  document: "",
  farms: [],
}

export function ProducerForm({ isEdit }: ProducerFormProps) {
  const { addProducer, updateProducer, producers } = useProducerStore()
  const { farms } = useFarmStore()

  const [open, setOpen] = useState<boolean>(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createProducerSchema(isEdit, producers)),
    defaultValues: isEdit ? {
      name: isEdit.name,
      document: isEdit.document,
      farms: isEdit.farms?.map(farm => farm.id)
    } : defaultValues,
  })

  const onSubmit = (data: FormValues) => {
    const selectedFarmObjects = farms.filter(f => data.farms?.includes(f.id)) || []
    if (isEdit) {
      updateProducer({
        ...isEdit,
        ...data,
        farms: selectedFarmObjects,
      })
      toast.success("Produtor atualizado com sucesso!")
    } else {
      addProducer({
        name: data.name,
        document: data.document,
        farms: selectedFarmObjects,
      })
      toast.success("Produtor cadastrado com sucesso!")
    }

    setOpen(false)
    reset()
  }

  useEffect(() => {
    reset(isEdit ? {
      name: isEdit.name,
      document: isEdit.document,
      farms: isEdit.farms?.map(farm => farm.id)
    } : defaultValues)
  }, [isEdit, reset])

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset()
        setOpen(isOpen)
      }}>
      <SheetTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="default">Cadastrar produtor</Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar produtor" : "Cadastrar produtor"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Edite os dados do produtor" : "Cadastre um novo produtor para começar a gerenciar suas fazendas."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produtor</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Documento</Label>
            <Controller
              control={control}
              name="document"
              render={({ field }) => (
                <Input
                  id="document"
                  value={MaskDocument(field.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                  maxLength={18}
                />
              )}
            />
            {errors.document && <p className="text-red-500 text-sm">{errors.document.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Fazendas Associadas (opcional)</Label>
            <Controller
              control={control}
              name="farms"
              render={({ field }) => (
                <MultiSelect
                  options={farms.map(farm => ({
                    label: farm.name,
                    value: farm.id
                  }))}
                  defaultValue={field.value}
                  onValueChange={(values) => field.onChange(values)}
                  placeholder="Selecione as fazendas"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            {isEdit ? "Atualizar produtor" : "Cadastrar produtor"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
