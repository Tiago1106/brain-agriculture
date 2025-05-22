import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TableCell, TableHead, TableHeader, TableRow, TableBody, Table } from "../ui/table";
import { Farm } from "@/stores/useProducerStore"; // Supondo que Season = Safra e Product = Produto
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useState, Fragment } from "react";

interface TableFarmsProps {
  farms: Farm[]
  deleteFarm: (id: string) => void
  isHydrated: boolean
}

export function TableFarms({ farms, deleteFarm, isHydrated }: TableFarmsProps) {
  const router = useRouter()
  const [expandedFarmIds, setExpandedFarmIds] = useState<string[]>([]);
  const [expandedSeasonIds, setExpandedSeasonIds] = useState<string[]>([]);

  function toggleExpandFarm(id: string) {
    setExpandedFarmIds(current =>
      current.includes(id) ? current.filter(i => i !== id) : [...current, id]
    );
  }

  function toggleExpandSeason(id: string) {
    setExpandedSeasonIds(current =>
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

                  {isFarmExpanded && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10"></TableHead>
                              <TableHead>Safra</TableHead>
                              <TableHead>Área Plantada</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {farm.harvests?.map(season => {
                              const isSeasonExpanded = expandedSeasonIds.includes(season.id);

                              return (
                                <Fragment key={season.id}>
                                  <TableRow>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpandSeason(season.id)}
                                      >
                                        {isSeasonExpanded ? (
                                          <ChevronUp className="w-5 h-5" />
                                        ) : (
                                          <ChevronDown className="w-5 h-5" />
                                        )}
                                      </Button>
                                    </TableCell>
                                    <TableCell>{season.year}</TableCell>
                                    <TableCell>{farm.agriculturalArea ?? "N/A"}</TableCell>
                                  </TableRow>

                                  {isSeasonExpanded && (
                                    <TableRow>
                                      <TableCell colSpan={6}>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Produto</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {season.crops?.length > 0 ?
                                              season.crops?.map((product) => (
                                                <TableRow key={product.id}>
                                                  <TableCell>{product.name}</TableCell>
                                                </TableRow>
                                              ))
                                              : (
                                                <TableRow>
                                                  <TableCell colSpan={4} className=" italic text-gray-500">
                                                    Nenhum produto cadastrado.
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
                            }) ?? (
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
