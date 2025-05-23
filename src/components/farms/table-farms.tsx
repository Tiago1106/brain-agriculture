import { ChevronDown, ChevronUp } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell, TableHead, TableHeader, TableRow, TableBody, Table } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { useState, Fragment } from "react";
import { FarmForm } from "./forms/form-farm";
import { useFarmStore } from "@/stores/useFarmStore";

export function TableFarms() {
  const { farms, deleteFarm, isHydrated } = useFarmStore()
  const [expandedFarmIds, setExpandedFarmIds] = useState<string[]>([]);

  function toggleExpandFarm(id: string) {
    setExpandedFarmIds(current =>
      current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
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
                <TableCell>
                  <Skeleton className="w-5 h-5" />
                </TableCell>
                <TableCell className="font-medium">
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-10" />
                </TableCell>
                <TableCell>
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
            {farms.map(farm => {
              const isFarmExpanded = expandedFarmIds.includes(farm.id);

              return (
                <Fragment key={farm.id}>
                  <TableRow>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleExpandFarm(farm.id)}>
                        {isFarmExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{farm.name}</TableCell>
                    <TableCell>{farm.city}</TableCell>
                    <TableCell>{farm.state}</TableCell>
                    <TableCell>{farm.totalArea}</TableCell>
                    <TableCell>{farm.agriculturalArea}</TableCell>
                    <TableCell>{farm.vegetationArea}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <FarmForm isEdit={farm} />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteFarm(farm.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {isFarmExpanded && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Safra</TableHead>
                              <TableHead>Produto</TableHead>
                              <TableHead>Área Plantada</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {farm.harvests?.map(season => (
                              season.crops.map(crop => (
                                <TableRow key={season.id}>
                                  <TableCell>{season.year}</TableCell>
                                  <TableCell>{crop.name}</TableCell>
                                  <TableCell>{farm.agriculturalArea ?? "N/A"}</TableCell>
                                </TableRow>
                              ))
                            )) ?? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center italic text-gray-500">
                                  Nenhuma safra cadastrada.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        )}
      </Table>
    </div>
  )
}
