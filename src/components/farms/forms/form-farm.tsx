"use client"

import { useForm, useFieldArray, Control, FieldErrors } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Farm, useFarmStore } from "@/stores/useFarmStore"
import { nanoid } from "nanoid"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const schema = z.object({
  name: z.string().min(3, "Nome da fazenda obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
  totalArea: z.number().min(0.1, "Área total deve ser maior que zero"),
  agriculturalArea: z.number().min(0, "Área agricultável não pode ser negativa"),
  vegetationArea: z.number().min(0, "Área de vegetação não pode ser negativa"),
  harvests: z
    .array(
      z.object({
        year: z.string().min(4, "Ano da safra obrigatório").max(4, "Ano da safra inválido"),
        crops: z
          .array(
            z.object({
              id: z.string(),
              name: z.string().min(2, "Nome da cultura obrigatório"),
            })
          )
          .optional(),
      })
    )
    .min(1, "Cadastre ao menos uma safra"),
}).refine(
  (data) => data.agriculturalArea + data.vegetationArea <= data.totalArea,
  {
    message: "A soma da área agricultável e vegetação deve ser menor ou igual à área total",
    path: ["agriculturalArea"],
  }
)

type FormValues = z.infer<typeof schema>

export function FarmForm() {
  const { addFarm } = useFarmStore()
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      totalArea: 0,
      agriculturalArea: 0,
      vegetationArea: 0,
      harvests: [{ year: "", crops: [] }],
    },
  })

  const { fields: harvestFields, append: appendHarvest, remove: removeHarvest } = useFieldArray({
    control,
    name: "harvests",
  })

  const onSubmit = (data: FormValues) => {
    addFarm(data as Omit<Farm, "id">)
    toast.success("Fazenda cadastrada com sucesso!")
    router.push("/farm")
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Input id="state" {...register("state")} />
            {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalArea">Área Total (ha)</Label>
            <Input type="number" step="0.01" id="totalArea" {...register("totalArea", { valueAsNumber: true })} />
            {errors.totalArea && <p className="text-red-600 text-sm">{errors.totalArea.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="agriculturalArea">Área Agricultável (ha)</Label>
            <Input type="number" step="0.01" id="agriculturalArea" {...register("agriculturalArea", { valueAsNumber: true })} />
            {errors.agriculturalArea && <p className="text-red-600 text-sm">{errors.agriculturalArea.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vegetationArea">Área de Vegetação (ha)</Label>
            <Input type="number" step="0.01" id="vegetationArea" {...register("vegetationArea", { valueAsNumber: true })} />
            {errors.vegetationArea && <p className="text-red-600 text-sm">{errors.vegetationArea.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Safras</Label>
          {harvestFields.map((harvest, harvestIndex) => (
            <div key={harvest.id} className="mb-4 border rounded p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <Label htmlFor={`harvests.${harvestIndex}.year`}>Ano da Safra</Label>
                  <Input
                    id={`harvests.${harvestIndex}.year`}
                    {...register(`harvests.${harvestIndex}.year` as const)}
                  />
                  {errors.harvests?.[harvestIndex]?.year && (
                    <p className="text-red-600 text-sm">{errors.harvests[harvestIndex]?.year?.message}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="mt-6 ml-4"
                  onClick={() => removeHarvest(harvestIndex)}
                >
                  Remover Safra
                </Button>
              </div>

              <HarvestCrops
                control={control}
                harvestIndex={harvestIndex}
                errors={errors}
              />
            </div>
          ))}

          <Button type="button" onClick={() => appendHarvest({ year: "", crops: [{ id: nanoid(), name: "" }] })}>
            Adicionar Safra
          </Button>
        </div>

        <Button type="submit" className="w-full mt-6">
          Cadastrar Fazenda
        </Button>
      </form>
    </Card>
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
            onClick={() => remove(cropIndex)}
          >
            Remover
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
