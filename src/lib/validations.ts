import { Producer } from "@/stores/useProducerStore"
import { z } from "zod"

import { cpf, cnpj } from "cpf-cnpj-validator"

export const schemaFarm = z.object({
  name: z.string().min(3, "Nome da fazenda obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().min(2, "Estado obrigatório"),
  totalArea: z.number().min(0.1, "Área total deve ser maior que zero"),
  agriculturalArea: z.number().min(0, "Área agricultável não pode ser negativa"),
  vegetationArea: z.number().min(0, "Área de vegetação não pode ser negativa"),
  harvests: z
    .array(
      z.object({
        id: z.string(),
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

export const createProducerSchema = (isEdit?: { id: string }, producers?: Producer[]) =>
  z.object({
    name: z.string().min(3, "Nome obrigatório"),
    document: z
      .string()
      .refine((val) => cpf.isValid(val) || cnpj.isValid(val), {
        message: "CPF ou CNPJ inválido",
      })
      .refine((val) => {
        const unmasked = val.replace(/\D/g, "")
        const exists = producers?.some((p) =>
            p.document.replace(/\D/g, "") === unmasked && p.id !== isEdit?.id
          )
        return !exists
      }, {
        message: "CPF ou CNPJ já cadastrado",
      }),
    farms: z.array(z.string()).optional(),
  })