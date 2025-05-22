'use client'

import { useRouter } from 'next/navigation'
import { useProducerStore } from '@/stores/useProducerStore'

import { Button } from '@/components/ui/button'

import { TableProducers } from './table-producers'

export default function ProducersPage() {
  const { producers, deleteProducer, isHydrated } = useProducerStore()
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtores</h1>
        <Button onClick={() => router.push('/producers/new')}>
          Cadastrar produtor
        </Button>
      </div>

      {producers.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produtor cadastrado.</p>
      ) : (
        <TableProducers producers={producers} deleteProducer={deleteProducer} isHydrated={isHydrated} />
      )}
    </>
  )
}
