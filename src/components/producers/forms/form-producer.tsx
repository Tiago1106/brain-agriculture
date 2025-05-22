// components/forms/ProducerForm.tsx
"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useProducerStore } from "@/stores/useProducerStore"
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MaskDocument } from "@/lib/masks"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
const producers = useProducerStore.getState().producers

const schema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  document: z.string().refine((val) => cpf.isValid(val) || cnpj.isValid(val), {
    message: "CPF ou CNPJ inválido",
  }).refine((val) => {
    const alreadyExists = producers.some((p) => p.document === val)
    return !alreadyExists
  }, {
    message: "CPF ou CNPJ já cadastrado",
  }),
})

type FormValues = z.infer<typeof schema>

export function ProducerForm() {
  const { addProducer } = useProducerStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [document, setDocument] = useState<string>('')

  const onSubmit = (data: FormValues) => {
    addProducer({ ...data, farms: [] })
    toast.success("Produtor cadastrado com sucesso!")
    router.push("/producers")
  }

  return (
    <Card className="space-y-4 p-6 rounded-xl shadow">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produtor</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Documento</Label>
          <Input id="document" {...register("document")} value={MaskDocument(document)} maxLength={18} onChange={(e) => {
            setDocument(e.target.value)
          }} />
          {errors.document && (
            <p className="text-red-500 text-sm">{errors.document.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Cadastrar produtor
        </Button>
      </form>
    </Card>
  )
}
