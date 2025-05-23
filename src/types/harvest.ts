import { Crop } from "@/types/crop"

export type Harvest = {
  id: string
  year: string
  crops: Crop[]
}