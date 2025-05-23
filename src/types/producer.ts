import { Farm } from "@/types/farm"

export type Producer = {
  id: string
  document: string
  name: string
  farms?: Farm[]
}