import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

export type Crop = {
  id: string
  name: string
}

export type Harvest = {
  id: string
  year: string
  crops: Crop[]
}

export type Farm = {
  id: string
  name: string
  city: string
  state: string
  totalArea: number
  agriculturalArea: number
  vegetationArea: number
  harvests: Harvest[]
}

type FarmStore = {
  farms: Farm[]
  isHydrated: boolean
  setHydrated: (value: boolean) => void
  addFarm: (farm: Omit<Farm, "id">) => void
  updateFarm: (farm: Farm) => void
  deleteFarm: (id: string) => void
}

const mockFarms: Farm[] = [
  {
    id: nanoid(),
    name: "Fazenda Boa Vista",
    city: "Franca",
    state: "SP",
    totalArea: 200,
    agriculturalArea: 120,
    vegetationArea: 80,
    harvests: [
      {
        id: nanoid(),
        year: "2021",
        crops: [
          { id: nanoid(), name: "Soja" },
          { id: nanoid(), name: "Milho" },
        ],
      },
      {
        id: nanoid(),
        year: "2022",
        crops: [
          { id: nanoid(), name: "Café" },
        ],
      },
    ],
  },
  {
    id: nanoid(),
    name: "Fazenda Santa Luzia",
    city: "Ribeirão Preto",
    state: "SP",
    totalArea: 350,
    agriculturalArea: 200,
    vegetationArea: 150,
    harvests: [
      {
        id: nanoid(),
        year: "2021",
        crops: [
          { id: nanoid(), name: "Algodão" },
        ],
      },
      {
        id: nanoid(),
        year: "2023",
        crops: [
          { id: nanoid(), name: "Milho" },
          { id: nanoid(), name: "Cana-de-açúcar" },
        ],
      },
    ],
  },
]

export const useFarmStore = create<FarmStore>()(
  persist(
    (set) => ({
      farms: mockFarms,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      addFarm: (farm) =>
        set((state) => ({
          farms: [...state.farms, { ...farm, id: nanoid() }],
        })),
      updateFarm: (updatedFarm) =>
        set((state) => ({
          farms: state.farms.map((f) =>
            f.id === updatedFarm.id ? updatedFarm : f
          ),
        })),
      deleteFarm: (id) =>
        set((state) => ({
          farms: state.farms.filter((f) => f.id !== id),
        })),
    }),
    {
      name: "farm-store",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true)
      },
    }
  )
)