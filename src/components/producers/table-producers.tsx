import { Pencil } from "lucide-react";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell, TableHead, TableHeader, TableRow, TableBody, Table } from "../ui/table";
import { Producer } from "@/stores/useProducerStore";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface TableProducersProps {
  producers: Producer[]
  deleteProducer: (id: string) => void
  isHydrated: boolean
}

export function TableProducers({ producers, deleteProducer, isHydrated }: TableProducersProps) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Fazendas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        {!isHydrated ? (
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="w-10 h-10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {producers.map((producer) => (
              <TableRow key={producer.id}>
                <TableCell className="font-medium">{producer.name}</TableCell>
                <TableCell>{producer.document}</TableCell>
                <TableCell>{producer.farms?.length ?? 0}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/producers/${producer.id}/edit`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProducer(producer.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  )
} 