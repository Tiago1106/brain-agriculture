'use client'

import { useRouter } from 'next/navigation'
import { useFarmStore } from '@/stores/useFarmStore'

import { Button } from '@/components/ui/button'
import { TableFarms } from './table-farms'

export default function FarmsPage() {
  const { farms, deleteFarm, isHydrated } = useFarmStore()
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fazendas</h1>
        <Button onClick={() => router.push('/farm/new')}>
          Cadastrar fazenda
        </Button>
      </div>

      {farms.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma fazenda cadastrada.</p>
      ) : (
        <TableFarms farms={farms} deleteFarm={deleteFarm} isHydrated={isHydrated} />
      )}
    </>
  )
}
