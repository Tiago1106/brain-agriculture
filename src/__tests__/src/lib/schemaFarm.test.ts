import { schemaFarm } from "../../../lib/validations"

describe("schemaFarm", () => {
  const baseValidFarm = {
    name: "Fazenda Bela Vista",
    city: "Franca",
    state: "SP",
    totalArea: 100,
    agriculturalArea: 40,
    vegetationArea: 60,
    harvests: [
      {
        id: "1",
        year: "2024",
        crops: [
          { id: "1", name: "Soja" },
          { id: "2", name: "Milho" },
        ],
      },
    ],
  }

  it("valida corretamente uma fazenda com dados válidos", () => {
    const result = schemaFarm.safeParse(baseValidFarm)
    expect(result.success).toBe(true)
  })

  it("retorna erro se soma das áreas ultrapassar área total", () => {
    const invalidFarm = {
      ...baseValidFarm,
      agriculturalArea: 70,
      vegetationArea: 40, // 70 + 40 = 110 > totalArea: 100
    }

    const result = schemaFarm.safeParse(invalidFarm)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().agriculturalArea?._errors[0]).toBe(
        "A soma da área agricultável e vegetação deve ser menor ou igual à área total"
      )
    }
  })

  it("retorna erro se não houver nenhuma safra", () => {
    const invalidFarm = {
      ...baseValidFarm,
      harvests: [],
    }

    const result = schemaFarm.safeParse(invalidFarm)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().harvests?._errors[0]).toBe("Cadastre ao menos uma safra")
    }
  })

  it("retorna erro se nome da fazenda for muito curto", () => {
    const invalidFarm = {
      ...baseValidFarm,
      name: "Fa",
    }

    const result = schemaFarm.safeParse(invalidFarm)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().name?._errors[0]).toBe("Nome da fazenda obrigatório")
    }
  })

  it("retorna erro se o ano da safra tiver menos de 4 caracteres", () => {
    const invalidFarm = {
      ...baseValidFarm,
      harvests: [
        {
          id: "1",
          year: "20", // apenas 2 dígitos
          crops: [],
        },
      ],
    }
  
    const result = schemaFarm.safeParse(invalidFarm)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().harvests?.[0].year?._errors[0]).toBe("Ano da safra obrigatório")
    }
  })
})
