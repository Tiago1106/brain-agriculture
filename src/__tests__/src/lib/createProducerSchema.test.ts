import { createProducerSchema } from "../../../lib/validations"
import { cpf, cnpj } from "cpf-cnpj-validator"

describe("createProducerSchema", () => {
  it("valida corretamente um produtor com CPF válido", () => {
    const data = {
      name: "João",
      document: cpf.generate(),
    }

    const result = createProducerSchema().safeParse(data)
    expect(result.success).toBe(true)
  })

  it("valida corretamente um produtor com CNPJ válido", () => {
    const data = {
      name: "Empresa LTDA",
      document: cnpj.generate(),
    }

    const result = createProducerSchema().safeParse(data)
    expect(result.success).toBe(true)
  })

  it("retorna erro para CPF inválido", () => {
    const data = {
      name: "João",
      document: "123.456.789-00",
    }

    const result = createProducerSchema().safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().document?._errors[0]).toBe("CPF ou CNPJ inválido")
    }
  })

  it("retorna erro se CPF já estiver cadastrado", () => {
    const existingCpf = cpf.generate()

    const producers = [
      { id: "1", name: "Produtor Existente", document: existingCpf },
    ]

    const data = {
      name: "Novo Produtor",
      document: existingCpf,
    }

    const result = createProducerSchema(undefined, producers).safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().document?._errors[0]).toBe("CPF ou CNPJ já cadastrado")
    }
  })

  it("permite editar produtor com o mesmo CPF sem erro", () => {
    const existingCpf = cpf.generate()

    const producers = [
      { id: "1", name: "Produtor Existente", document: existingCpf },
    ]

    const data = {
      name: "Produtor Editado",
      document: existingCpf,
    }

    const result = createProducerSchema({ id: "1" }, producers).safeParse(data)
    expect(result.success).toBe(true)
  })
})
