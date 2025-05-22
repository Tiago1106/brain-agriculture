import { Pencil } from "lucide-react";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell, TableHead, TableHeader, TableRow, TableBody, Table } from "../ui/table";
import { Farm } from "@/stores/useProducerStore";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface TableFarmsProps {
  farms: Farm[]
  deleteFarm: (id: string) => void
  isHydrated: boolean
}

export function TableFarms({ farms, deleteFarm, isHydrated }: TableFarmsProps) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Área Total</TableHead>
            <TableHead>Área Agrícola</TableHead>
            <TableHead>Área Vegetativa</TableHead>
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
                <TableCell className="flex justify-end gap-2">
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="w-10 h-10" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">{farm.name}</TableCell>
                <TableCell>{farm.city}</TableCell>
                <TableCell>{farm.state}</TableCell>
                <TableCell>{farm.totalArea}</TableCell>
                <TableCell>{farm.agriculturalArea}</TableCell>
                <TableCell>{farm.vegetationArea}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/farms/${farm.id}/edit`)} 
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteFarm(farm.id)}
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