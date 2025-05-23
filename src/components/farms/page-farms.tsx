'use client'

import { useFarmStore } from '@/stores/useFarmStore'

import { TableFarms } from './table-farms'
import { FarmForm } from './forms/form-farm'

export default function FarmsPage() {
  const { farms, deleteFarm, isHydrated } = useFarmStore()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fazendas</h1>
        <FarmForm />
      </div>

      {farms.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma fazenda cadastrada.</p>
      ) : (
        <TableFarms farms={farms} deleteFarm={deleteFarm} isHydrated={isHydrated} />
      )}
    </>
  )
}
