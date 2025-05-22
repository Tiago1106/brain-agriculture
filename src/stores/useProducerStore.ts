import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

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

export type Producer = {
  id: string
  document: string
  name: string
  farms: Farm[]
}

type ProducerStore = {
  producers: Producer[]
  isHydrated: boolean
  setHydrated: (value: boolean) => void
  addProducer: (producer: Omit<Producer, 'id'>) => void
  updateProducer: (producer: Producer) => void
  deleteProducer: (id: string) => void
}

const mockProducers: Producer[] = [
  {
    id: nanoid(),
    document: '123.456.789-00',
    name: 'João da Silva',
    farms: [
      {
        id: nanoid(),
        name: 'Fazenda Boa Vista',
        city: 'Franca',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        harvests: [
          {
            id: nanoid(),
            year: '2022',
            crops: [
              { id: nanoid(), name: 'Soja' },
              { id: nanoid(), name: 'Milho' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: nanoid(),
    document: '987.654.321-00',
    name: 'Maria Oliveira',
    farms: [
      {
        id: nanoid(),
        name: 'Sítio Três Corações',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 80,
        agriculturalArea: 50,
        vegetationArea: 30,
        harvests: [
          {
            id: nanoid(),
            year: '2023',
            crops: [{ id: nanoid(), name: 'Café' }],
          },
        ],
      },
    ],
  },
]

export const useProducerStore = create<ProducerStore>()(
  persist(
    (set) => ({
      producers: mockProducers,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),

      addProducer: (producer) =>
        set((state) => ({
          producers: [...state.producers, { ...producer, id: nanoid() }],
        })),

      updateProducer: (updatedProducer) =>
        set((state) => ({
          producers: state.producers.map((p) =>
            p.id === updatedProducer.id ? updatedProducer : p
          ),
        })),

      deleteProducer: (id) =>
        set((state) => ({
          producers: state.producers.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'producer-store',
      // callback executada quando a reidratação acaba:
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true)
      },
    }
  )
)
