'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useFarmStore } from "@/stores/useFarmStore"
import { useMemo } from "react"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a6c"]

interface ChartData {
  name: string
  value: number
}

export function SectionPieCharts() {
  const { farms } = useFarmStore()

  const dataByState: ChartData[] = useMemo(() => {
    const map = new Map<string, number>()
    farms.forEach((farm) => {
      map.set(farm.state, (map.get(farm.state) || 0) + 1)
    })
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [farms])

  const dataByCrop: ChartData[] = useMemo(() => {
    const map = new Map<string, number>()
    farms.forEach((farm) => {
      farm.harvests?.forEach((harvest) => {
        harvest.crops?.forEach((crop) => {
          map.set(crop.name, (map.get(crop.name) || 0) + 1)
        })
      })
    })
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [farms])

  const dataByLandUse: ChartData[] = useMemo(() => {
    let agricultable = 0
    let vegetation = 0
    farms.forEach((farm) => {
      agricultable += farm.agriculturalArea || 0
      vegetation += farm.vegetationArea || 0
    })
    return [
      { name: "Área Agricultável", value: agricultable },
      { name: "Área de Vegetação", value: vegetation },
    ]
  }, [farms])

  const renderPie = (data: ChartData[]) => (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Distribuição por Estado</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPie(dataByState)}
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Distribuição por Cultura</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPie(dataByCrop)}
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Distribuição por Uso do Solo</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPie(dataByLandUse)}
        </CardContent>
      </Card>
    </div>
  )
}
