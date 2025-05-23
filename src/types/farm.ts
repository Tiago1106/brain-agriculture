import { Harvest } from "@/types/harvest"

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