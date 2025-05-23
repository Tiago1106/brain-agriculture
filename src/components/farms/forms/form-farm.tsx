"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash } from "lucide-react"
import { nanoid } from "nanoid"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, Control, FieldErrors, Controller } from "react-hook-form"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sheet } from "@/components/ui/sheet"

import { useFarmStore } from "@/stores/useFarmStore"

import { BrazilianStates } from "@/lib/enumStates"
import { schemaFarm } from "@/lib/validations"
import { Farm } from "@/types/farm"

type FormValues = z.infer<typeof schemaFarm>

const defaultValues: FormValues = {
  name: "",
  city: "",
  state: "",
  totalArea: 0,
  agriculturalArea: 0,
  vegetationArea: 0,
  harvests: [{ id: "", year: "", crops: [] }]
}

interface FarmFormProps {
  isEdit?: Farm | undefined
}

export function FarmForm({ isEdit }: FarmFormProps) {
  const { addFarm, updateFarm } = useFarmStore()
  const [open, setOpen] = useState<boolean>(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schemaFarm),
    defaultValues: isEdit || defaultValues,
  })

  const { fields: harvestFields, append: appendHarvest, remove: removeHarvest } = useFieldArray({
    control,
    name: "harvests",
  })

  const onSubmit = (data: FormValues) => {
    if (isEdit) {
      const newFarm = {
        ...isEdit,
        ...data,
      }
      updateFarm(newFarm as Farm)
      toast.success("Fazenda atualizada com sucesso!")
    } else {
      addFarm(data as Omit<Farm, "id">)
      toast.success("Fazenda cadastrada com sucesso!")
    }

    setOpen(false)
    reset()
  }

  useEffect(() => {
    reset(isEdit || defaultValues)
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
          <Button variant="default">Cadastrar fazenda</Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar fazenda" : "Cadastrar fazenda"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Edite os dados da fazenda" : "Cadastre uma nova fazenda para começar a gerenciar suas safras."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Fazenda</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} >
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {Object.entries(BrazilianStates).map(([abbr, name]) => (
                        <SelectItem key={abbr} value={abbr}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 h-[72px] justify-between flex flex-col">
              <Label htmlFor="totalArea">Área Total (ha)</Label>
              <Input type="number" step="1" id="totalArea" {...register("totalArea", { valueAsNumber: true })} />
              {errors.totalArea && <p className="text-red-600 text-sm">{errors.totalArea.message}</p>}
            </div>
            <div className="space-y-2 h-[72px] justify-between flex flex-col">
              <Label htmlFor="agriculturalArea">Área Agricultável (ha)</Label>
              <Input type="number" step="1" id="agriculturalArea" {...register("agriculturalArea", { valueAsNumber: true })} />
              {errors.agriculturalArea && <p className="text-red-600 text-sm">{errors.agriculturalArea.message}</p>}
            </div>
            <div className="space-y-2 h-[72px] justify-between flex flex-col">
              <Label htmlFor="vegetationArea">Área de Vegetação (ha)</Label>
              <Input type="number" step="1" id="vegetationArea" {...register("vegetationArea", { valueAsNumber: true })} />
              {errors.vegetationArea && <p className="text-red-600 text-sm">{errors.vegetationArea.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Safras</Label>
            {harvestFields.map((harvest, harvestIndex) => (
              <div key={harvest.id} className="mb-4 border rounded p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between items-end gap-2">
                  <div className="flex-1 flex flex-col gap-2">
                    <Label htmlFor={`harvests.${harvestIndex}.year`}>Ano da Safra</Label>
                    <Input
                      id={`harvests.${harvestIndex}.year`}
                      {...register(`harvests.${harvestIndex}.year` as const)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeHarvest(harvestIndex)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                {errors.harvests?.[harvestIndex]?.year && (
                  <p className="text-red-600 text-sm">{errors.harvests[harvestIndex]?.year?.message}</p>
                )}

                <HarvestCrops
                  control={control}
                  harvestIndex={harvestIndex}
                  errors={errors}
                />
              </div>
            ))}

            <Button type="button" onClick={() => appendHarvest({ id: nanoid(), year: "", crops: [{ id: nanoid(), name: "" }] })}>
              Adicionar Safra
            </Button>
          </div>

          <Button type="submit" className="w-full mt-6">
            {isEdit ? "Atualizar Fazenda" : "Cadastrar Fazenda"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

interface HarvestCropsProps {
  control: Control<FormValues>
  harvestIndex: number
  errors: FieldErrors<FormValues>
}

function HarvestCrops({ control, harvestIndex, errors }: HarvestCropsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `harvests.${harvestIndex}.crops`,
  })

  return (
    <div className="space-y-2">
      <Label>Culturas Plantadas</Label>
      {fields.map((crop, cropIndex) => (
        <div key={crop.id} className="flex gap-2 items-center mb-2">
          <Input
            {...control.register(`harvests.${harvestIndex}.crops.${cropIndex}.name`)}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(cropIndex)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() => append({ id: nanoid(), name: "" })}
      >
        Adicionar Cultura
      </Button>

      {errors.harvests?.[harvestIndex]?.crops && (
        <p className="text-red-600 text-sm">
          {errors.harvests[harvestIndex]?.crops?.message as string}
        </p>
      )}
    </div>
  )
}
