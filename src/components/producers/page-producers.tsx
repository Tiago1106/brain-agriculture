'use client'

import { useProducerStore } from '@/stores/useProducerStore'

import { TableProducers } from './table-producers'
import { ProducerForm } from './forms/form-producer'

export default function ProducersPage() {
  const { producers } = useProducerStore()

  return (
    <>
      <div className="flex items-center justify-end">
        <ProducerForm />
      </div>

      {producers.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produtor cadastrado.</p>
      ) : (
        <TableProducers />
      )}
    </>
  )
}
