'use client'

import { useFarmStore } from '@/stores/useFarmStore'

import { TableFarms } from '@/components/farms/table-farms'
import { FarmForm } from '@/components/farms/forms/form-farm'

export default function FarmsPage() {
  const { farms } = useFarmStore()

  return (
    <>
      <div className="flex items-center justify-end">
        <FarmForm />
      </div>

      {farms.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma fazenda cadastrada.</p>
      ) : (
        <TableFarms />
      )}
    </>
  )
}
