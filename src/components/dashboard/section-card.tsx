'use client'

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useFarmStore } from "@/stores/useFarmStore"
import { useProducerStore } from "@/stores/useProducerStore"


export function SectionCards() {
  const router = useRouter()

  const { farms } = useFarmStore()
  const { producers } = useProducerStore()

  const crops = useMemo(() => {
    const harvests = farms.flatMap((farm) => farm.harvests)
    return harvests.flatMap((harvest) => harvest.crops)
  }, [farms])

  const totalArea = useMemo(() => {
    return farms.reduce((acc, farm) => acc + farm.totalArea, 0)
  }, [farms])

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total de fazendas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {farms.length}
          </CardTitle>
          <div className="absolute right-4">
            <Button variant="outline" size="icon" onClick={() => router.push('/farm')}>
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Número total de propriedades registradas no sistema.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total de produtores</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {producers.length}
          </CardTitle>
          <div className="absolute right-4">
            <Button variant="outline" size="icon" onClick={() => router.push('/producers')}>
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total de produtores rurais atualmente registrados.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total de culturas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {crops.length}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Quantidade total de culturas plantadas nas safras.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total de hectares</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalArea}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Soma da área total de todas as fazendas cadastradas.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
